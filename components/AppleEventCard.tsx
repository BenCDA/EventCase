import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { WeatherCard } from './WeatherCard';
import { WeatherService } from '@/services/weatherService';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Event, WeatherData } from '@/types';

interface AppleEventCardProps {
  event: Event;
  onPress: () => void;
  onParticipatePress: () => void;
  onDeletePress?: () => void;
  isCreatedByUser?: boolean;
}

export function AppleEventCard({
  event,
  onPress,
  onParticipatePress,
  onDeletePress,
  isCreatedByUser
}: AppleEventCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const eventDate = new Date(event.date);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Charger la météo pour l'événement
  useEffect(() => {
    const loadWeather = async () => {
      if (!event.location) return;

      try {
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
      }
    };

    loadWeather();
  }, [event.location]);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderLight,
        },
        Shadows.sm
      ]}
      onPress={onPress}
      activeOpacity={0.6}
    >
      <View style={styles.content}>
        {/* Date et heure */}
        <View style={styles.dateTimeSection}>
          <View style={styles.dateTimeRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>
              {formatDate(eventDate)}
            </Text>
          </View>
          <View style={styles.dateTimeRow}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {event.time}
            </Text>
          </View>
        </View>

        {/* Contenu principal */}
        <View style={styles.mainContent}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
              {event.title}
            </Text>
            {isCreatedByUser && onDeletePress && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={onDeletePress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={16} color={colors.error} />
              </TouchableOpacity>
            )}
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {event.description}
          </Text>

          {event.location && (
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={14} color={colors.success} />
              <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
                {event.location.name}
              </Text>
            </View>
          )}

          {/* Météo compacte */}
          {weather && (
            <View style={styles.weatherContainer}>
              <WeatherCard weather={weather} compact />
            </View>
          )}

          <View style={styles.footer}>
            {/* Participants */}
            <View style={styles.participantsInfo}>
              <Ionicons name="people-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.participantCount, { color: colors.textMuted }]}>
                {event.participants.length === 0
                  ? 'Aucun participant'
                  : `${event.participants.length} participant${event.participants.length > 1 ? 's' : ''}`
                }
              </Text>
            </View>

            {/* Bouton de participation */}
            <TouchableOpacity
              style={[
                styles.participateButton,
                event.isParticipating
                  ? { backgroundColor: colors.success }
                  : { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary }
              ]}
              onPress={onParticipatePress}
            >
              <Text
                style={[
                  styles.participateText,
                  event.isParticipating
                    ? { color: '#FFFFFF' }
                    : { color: colors.primary }
                ]}
              >
                {event.isParticipating ? 'Participe' : 'Participer'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
  },
  content: {
    padding: Spacing.md,
  },
  dateTimeSection: {
    marginBottom: Spacing.sm,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs / 2,
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  timeText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  mainContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 20,
    fontWeight: Typography.fontWeight.bold,
    lineHeight: 20,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  location: {
    fontSize: Typography.fontSize.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  participantCount: {
    fontSize: Typography.fontSize.xs,
  },
  participateButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    minWidth: 80,
    alignItems: 'center',
  },
  participateText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  weatherContainer: {
    marginBottom: Spacing.sm,
  },
});