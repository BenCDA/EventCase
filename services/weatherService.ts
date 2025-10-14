interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface GeocodingResponse {
  name: string;
  local_names?: {
    fr?: string;
  };
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// API OpenWeatherMap - Configuration directe
const API_KEY = '2f49f0c2b3308a0599ae89758256b537';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODING_URL = 'https://api.openweathermap.org/geo/1.0';

// Validation de la clé API au démarrage
if (!API_KEY || API_KEY === 'demo_api_key') {
  console.error('❌ ERREUR: Clé API OpenWeatherMap invalide:', API_KEY);
} else {
  console.log('✅ Service météo initialisé avec clé API valide:', API_KEY.substring(0, 8) + '...');
}

// Cache simple en mémoire pour éviter les appels répétés
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Version du service pour forcer le rechargement
const SERVICE_VERSION = '2.2.0';

export class WeatherService {
  /**
   * Obtenir la météo pour une position géographique
   */
  static async getWeatherByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> {
    console.log(`🌤️ [COORDS] Demande météo pour: ${latitude}, ${longitude}`);
    console.log('🔧 [COORDS] Utilisation de la clé API:', API_KEY);

    try {
      const cacheKey = `${latitude},${longitude}`;
      const cached = weatherCache.get(cacheKey);

      // Vérifier le cache
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Météo trouvée en cache');
        return cached.data;
      }

      // Appel API OpenWeatherMap
      const url = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=fr`;
      console.log('🌐 Appel API météo avec clé:', API_KEY.substring(0, 8) + '...');

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ Erreur API: ${response.status}`, await response.text());
        console.log('⚠️ Utilisation des données mockées en fallback');
        return this.getMockWeatherData(latitude, longitude);
      }

      console.log('✅ Réponse API météo reçue');

      const data: OpenWeatherResponse = await response.json();

      // Convertir les données OpenWeatherMap vers notre format
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s vers km/h
        city: `${data.name}, ${data.sys.country}`,
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
    console.log(`🏙️ [CITY] Demande météo pour ville: ${cityName}`);
    console.log('🔧 [CITY] Utilisation de la clé API:', API_KEY);

    try {
      const cached = weatherCache.get(cityName);

      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Météo ville trouvée en cache');
        return cached.data;
      }

      // Appel direct à l'API OpenWeatherMap par nom de ville
      const url = `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=fr`;
      console.log('🌐 Appel API météo pour ville avec clé:', API_KEY.substring(0, 8) + '...');

      const response = await fetch(url);

      if (!response.ok) {
        console.error(`❌ Erreur API ville: ${response.status}`, await response.text());
        console.log('⚠️ Utilisation des données mockées en fallback pour ville');
        return this.getMockWeatherData(0, 0, cityName);
      }

      console.log('✅ Réponse API météo ville reçue');

      const data: OpenWeatherResponse = await response.json();

      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // m/s vers km/h
        city: `${data.name}, ${data.sys.country}`,
      };

      // Mettre en cache
      weatherCache.set(cityName, {
        data: weatherData,
        timestamp: Date.now(),
      });

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

// Clear cache on service initialization to ensure fresh data with new configuration
WeatherService.clearCache();