interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  current_units: {
    temperature_2m: string;
    relative_humidity_2m: string;
    wind_speed_10m: string;
  };
}

interface GeocodingResponse {
  results: Array<{
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}

// API Open-Meteo - Gratuite et sans clé API
const BASE_URL = 'https://api.open-meteo.com/v1';
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1';

// Cache simple en mémoire pour éviter les appels répétés
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export class WeatherService {
  /**
   * Obtenir la météo pour une position géographique
   */
  static async getWeatherByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    try {
      const cacheKey = `${latitude},${longitude}`;
      const cached = weatherCache.get(cacheKey);

      // Vérifier le cache
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      // Appel API Open-Meteo
      const response = await fetch(
        `${BASE_URL}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );

      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.status}`);
      }

      const data: OpenMeteoResponse = await response.json();

      // Convertir les données Open-Meteo vers notre format
      const weatherData: WeatherData = {
        temperature: Math.round(data.current.temperature_2m),
        condition: this.getConditionFromWeatherCode(data.current.weather_code),
        description: this.getDescriptionFromWeatherCode(data.current.weather_code),
        icon: this.getIconFromWeatherCode(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        city: await this.getCityName(latitude, longitude),
      };

      // Mettre en cache
      weatherCache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now(),
      });

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather:', error);
      // Fallback vers des données mockées en cas d'erreur
      return this.getMockWeatherData(latitude, longitude);
    }
  }

  /**
   * Obtenir la météo pour une ville
   */
  static async getWeatherByCity(cityName: string): Promise<WeatherData | null> {
    try {
      const cached = weatherCache.get(cityName);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }

      // D'abord, obtenir les coordonnées de la ville
      const coords = await this.getCoordinatesFromCity(cityName);
      if (!coords) {
        throw new Error(`City not found: ${cityName}`);
      }

      // Ensuite, obtenir la météo pour ces coordonnées
      const weatherData = await this.getWeatherByCoordinates(coords.latitude, coords.longitude);

      if (weatherData) {
        weatherData.city = cityName;

        // Mettre en cache avec le nom de la ville
        weatherCache.set(cityName, {
          data: weatherData,
          timestamp: Date.now(),
        });
      }

      return weatherData;
    } catch (error) {
      console.error('Error fetching weather by city:', error);
      // Fallback vers des données mockées
      return this.getMockWeatherData(0, 0, cityName);
    }
  }

  /**
   * Convertir le code d'icône météo en émoji
   */
  static getWeatherEmoji(icon: string): string {
    const iconMap: Record<string, string> = {
      '01d': '☀️', // clear sky day
      '01n': '🌙', // clear sky night
      '02d': '⛅', // few clouds day
      '02n': '☁️', // few clouds night
      '03d': '☁️', // scattered clouds
      '03n': '☁️',
      '04d': '☁️', // broken clouds
      '04n': '☁️',
      '09d': '🌧️', // shower rain
      '09n': '🌧️',
      '10d': '🌦️', // rain day
      '10n': '🌧️', // rain night
      '11d': '⛈️', // thunderstorm
      '11n': '⛈️',
      '13d': '🌨️', // snow
      '13n': '🌨️',
      '50d': '🌫️', // mist
      '50n': '🌫️',
    };

    return iconMap[icon] || '🌤️';
  }

  /**
   * Obtenir le nom de la ville à partir des coordonnées
   */
  private static async getCityName(latitude: number, longitude: number): string {
    try {
      const response = await fetch(
        `${GEOCODING_URL}/search?latitude=${latitude}&longitude=${longitude}&count=1&language=fr&format=json`
      );

      if (response.ok) {
        const data: GeocodingResponse = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          return result.admin1 ? `${result.name}, ${result.admin1}` : result.name;
        }
      }
    } catch (error) {
      console.error('Error getting city name:', error);
    }

    return 'Ville inconnue';
  }

  /**
   * Obtenir les coordonnées d'une ville
   */
  private static async getCoordinatesFromCity(cityName: string): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const response = await fetch(
        `${GEOCODING_URL}/search?name=${encodeURIComponent(cityName)}&count=1&language=fr&format=json`
      );

      if (response.ok) {
        const data: GeocodingResponse = await response.json();
        if (data.results && data.results.length > 0) {
          const result = data.results[0];
          return {
            latitude: result.latitude,
            longitude: result.longitude
          };
        }
      }
    } catch (error) {
      console.error('Error getting coordinates:', error);
    }

    return null;
  }

  /**
   * Convertir les codes météo Open-Meteo en condition
   */
  private static getConditionFromWeatherCode(code: number): string {
    const codeMap: Record<number, string> = {
      0: 'Clear',
      1: 'Clear', 2: 'Clear', 3: 'Clouds',
      45: 'Mist', 48: 'Mist',
      51: 'Rain', 53: 'Rain', 55: 'Rain',
      56: 'Rain', 57: 'Rain',
      61: 'Rain', 63: 'Rain', 65: 'Rain',
      66: 'Rain', 67: 'Rain',
      71: 'Snow', 73: 'Snow', 75: 'Snow',
      77: 'Snow',
      80: 'Rain', 81: 'Rain', 82: 'Rain',
      85: 'Snow', 86: 'Snow',
      95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
    };

    return codeMap[code] || 'Unknown';
  }

  /**
   * Convertir les codes météo Open-Meteo en description française
   */
  private static getDescriptionFromWeatherCode(code: number): string {
    const codeMap: Record<number, string> = {
      0: 'Ciel dégagé',
      1: 'Principalement dégagé', 2: 'Partiellement nuageux', 3: 'Couvert',
      45: 'Brouillard', 48: 'Brouillard givrant',
      51: 'Bruine légère', 53: 'Bruine modérée', 55: 'Bruine dense',
      56: 'Bruine verglaçante légère', 57: 'Bruine verglaçante dense',
      61: 'Pluie légère', 63: 'Pluie modérée', 65: 'Pluie forte',
      66: 'Pluie verglaçante légère', 67: 'Pluie verglaçante forte',
      71: 'Neige légère', 73: 'Neige modérée', 75: 'Neige forte',
      77: 'Grains de neige',
      80: 'Averses légères', 81: 'Averses modérées', 82: 'Averses violentes',
      85: 'Averses de neige légères', 86: 'Averses de neige fortes',
      95: 'Orage léger', 96: 'Orage avec grêle légère', 99: 'Orage avec grêle forte'
    };

    return codeMap[code] || 'Conditions inconnues';
  }

  /**
   * Convertir les codes météo Open-Meteo en icône
   */
  private static getIconFromWeatherCode(code: number): string {
    const codeMap: Record<number, string> = {
      0: '01d',
      1: '01d', 2: '02d', 3: '03d',
      45: '50d', 48: '50d',
      51: '09d', 53: '09d', 55: '09d',
      56: '09d', 57: '09d',
      61: '10d', 63: '10d', 65: '10d',
      66: '10d', 67: '10d',
      71: '13d', 73: '13d', 75: '13d',
      77: '13d',
      80: '09d', 81: '09d', 82: '09d',
      85: '13d', 86: '13d',
      95: '11d', 96: '11d', 99: '11d'
    };

    return codeMap[code] || '01d';
  }

  /**
   * Données mockées de fallback
   */
  private static getMockWeatherData(latitude: number, longitude: number, cityName?: string): WeatherData {
    return {
      temperature: Math.round(15 + Math.random() * 15),
      condition: this.getRandomCondition(),
      description: this.getRandomDescription(),
      icon: this.getRandomIcon(),
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(Math.random() * 20),
      city: cityName || this.getMockCityName(latitude, longitude),
    };
  }

  // Méthodes privées pour les données mockées de fallback
  private static getRandomCondition(): string {
    const conditions = ['Clear', 'Clouds', 'Rain', 'Snow', 'Mist'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private static getRandomDescription(): string {
    const descriptions = [
      'ciel dégagé', 'quelques nuages', 'nuageux',
      'pluie légère', 'ensoleillé', 'partiellement nuageux'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private static getRandomIcon(): string {
    const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d'];
    return icons[Math.floor(Math.random() * icons.length)];
  }

  private static getMockCityName(lat: number, lng: number): string {
    const cities = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes'];
    return cities[Math.floor(Math.random() * cities.length)];
  }

  /**
   * Vider le cache météo
   */
  static clearCache(): void {
    weatherCache.clear();
  }

  /**
   * Obtenir la taille du cache
   */
  static getCacheSize(): number {
    return weatherCache.size;
  }
}

export type { WeatherData };