import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { WeatherData } from '@/types';
import { WeatherService } from '@/services/weatherService';

interface WeatherCardProps {
  weather: WeatherData;
  compact?: boolean;
}

export function WeatherCard({ weather, compact = false }: WeatherCardProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'sunny-outline';
      case 'clouds':
        return 'partly-sunny-outline';
      case 'rain':
        return 'rainy-outline';
      case 'snow':
        return 'snow-outline';
      case 'thunderstorm':
        return 'thunderstorm-outline';
      case 'mist':
      case 'fog':
        return 'cloudy-outline';
      default:
        return 'partly-sunny-outline';
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return '#64B5F6'; // Bleu pour froid
    if (temp < 20) return colors.primary; // Orange pour tempéré
    return '#FF5722'; // Rouge pour chaud
  };

  if (compact) {
    return (
      <View style={[styles.compactContainer, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
        <View style={styles.compactContent}>
          <Ionicons
            name={getWeatherIcon(weather.condition)}
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.compactTemp, { color: getTemperatureColor(weather.temperature) }]}>
            {weather.temperature}°
          </Text>
          <Text style={[styles.compactDescription, { color: colors.textMuted }]}>
            {weather.description}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={styles.header}>
        <View style={styles.mainInfo}>
          <View style={styles.temperatureContainer}>
            <Text style={[styles.temperature, { color: getTemperatureColor(weather.temperature) }]}>
              {weather.temperature}°C
            </Text>
            <Text style={[styles.weatherEmoji]}>
              {WeatherService.getWeatherEmoji(weather.icon)}
            </Text>
          </View>
          <View style={styles.weatherInfo}>
            <Text style={[styles.condition, { color: colors.text }]}>
              {weather.condition}
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {weather.description}
            </Text>
          </View>
        </View>
        <Ionicons
          name={getWeatherIcon(weather.condition)}
          size={32}
          color={colors.primary}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="water-outline" size={16} color={colors.accent} />
          <Text style={[styles.detailText, { color: colors.textMuted }]}>
            {weather.humidity}%
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="leaf-outline" size={16} color={colors.success} />
          <Text style={[styles.detailText, { color: colors.textMuted }]}>
            {weather.windSpeed} km/h
          </Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.detailText, { color: colors.textMuted }]}>
            {weather.city}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mainInfo: {
    flex: 1,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  temperature: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  weatherEmoji: {
    fontSize: Typography.fontSize.xl,
  },
  weatherInfo: {
    gap: 2,
  },
  condition: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    textTransform: 'capitalize',
  },
  details: {
    flexDirection: 'row',
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  detailText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },

  // Styles pour le mode compact
  compactContainer: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 0.5,
  },
  compactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactTemp: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  compactDescription: {
    fontSize: Typography.fontSize.xs,
    textTransform: 'capitalize',
    flex: 1,
  },
});