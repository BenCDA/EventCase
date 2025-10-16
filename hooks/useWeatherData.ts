import { useState, useEffect } from 'react';
import { WeatherService } from '@/services/weatherService';
import { WeatherData, Event } from '@/types';

export function useWeatherData(event: Event) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWeather = async () => {
      if (!event.location) return;

      try {
        setLoading(true);
        let weatherData: WeatherData | null = null;

        if (event.location.latitude && event.location.longitude) {
          weatherData = await WeatherService.getWeatherByCoordinates(
            event.location.latitude,
            event.location.longitude
          );
        } else if (event.location.name) {
          weatherData = await WeatherService.getWeatherByCity(event.location.name);
        }

        setWeather(weatherData);
      } catch (error) {
        console.log('Could not load weather for event card:', error);
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [event.location]);

  return { weather, loading };
}