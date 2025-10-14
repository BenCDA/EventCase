import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherService } from '@/services/weatherService';
import { WeatherData } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import * as Location from 'expo-location';

// Composants extraits
import { EventDetailsHeader } from '@/components/event-details/EventDetailsHeader';
import { EventMainCard } from '@/components/event-details/EventMainCard';
import { EventLocationSection } from '@/components/event-details/EventLocationSection';
import { EventParticipantsSection } from '@/components/event-details/EventParticipantsSection';
import { EventActionButton } from '@/components/event-details/EventActionButton';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent, toggleParticipation } = useEvents();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // States
  const [distance, setDistance] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const event = useMemo(() => {
    return events.find(e => e.id === id);
  }, [events, id]);

  // Calculer automatiquement la distance au chargement
  useEffect(() => {
    const calculateDistanceOnLoad = async () => {
      if (!event?.location?.latitude || !event?.location?.longitude) return;

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        const userLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const { latitude: userLat, longitude: userLng } = userLocation.coords;
        const calculatedDistance = calculateDistance(
          userLat,
          userLng,
          event.location.latitude,
          event.location.longitude
        );

        setDistance(calculatedDistance);
      } catch (error) {
        console.log('Could not calculate distance automatically:', error);
      }
    };

    calculateDistanceOnLoad();
  }, [event]);

  // Charger la météo pour l'événement
  useEffect(() => {
    const loadWeather = async () => {
      if (!event) return;

      try {
        setLoadingWeather(true);
        let weatherData: WeatherData | null = null;

        // Essayer d'abord avec les coordonnées GPS
        if (event.location?.latitude && event.location?.longitude) {
          weatherData = await WeatherService.getWeatherByCoordinates(
            event.location.latitude,
            event.location.longitude
          );
        }
        // Sinon essayer avec le nom de la ville
        else if (event.location?.name) {
          weatherData = await WeatherService.getWeatherByCity(event.location.name);
        }

        setWeather(weatherData);
      } catch (error) {
        console.error('Error loading weather:', error);
      } finally {
        setLoadingWeather(false);
      }
    };

    loadWeather();
  }, [event]);

  // Calculer dynamiquement la participation
  const isCreatedByUser = event?.createdBy === user?.id;
  const isParticipating = user ? event?.participants.includes(user.id) ?? false : false;

  // Handlers
  const handleDeleteEvent = () => {
    if (!event) return;

    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteEvent(event.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleToggleParticipation = async () => {
    if (!event || !user) return;

    try {
      await toggleParticipation(event.id);
    } catch (error) {
      console.error('Error toggling participation:', error);
    }
  };

  // Fonction utilitaire pour calculer la distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.errorContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Événement non trouvé
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <EventDetailsHeader
        isCreatedByUser={isCreatedByUser}
        onDeleteEvent={handleDeleteEvent}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <EventMainCard event={event} />

        <EventLocationSection event={event} distance={distance} />

        {/* Weather Section */}
        {weather && (
          <View style={[styles.weatherCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="partly-sunny-outline" size={18} color={colors.accent} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Météo prévue</Text>
            </View>
            <WeatherCard weather={weather} />
          </View>
        )}

        <EventParticipantsSection
          event={event}
          isParticipating={isParticipating}
        />

        <EventActionButton
          event={event}
          isCreatedByUser={isCreatedByUser}
          isParticipating={isParticipating}
          onToggleParticipation={handleToggleParticipation}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  weatherCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.lg,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.fontSize.lg,
    textAlign: 'center',
  },
});