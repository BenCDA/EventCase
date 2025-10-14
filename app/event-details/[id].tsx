import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherService } from '@/services/weatherService';
import { WeatherData } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import * as Location from 'expo-location';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent, toggleParticipation, updateEvent } = useEvents();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const insets = useSafeAreaInsets();

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

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.6}
          >
            <Text style={[styles.backButtonText, { color: colors.primary }]}>← Retour</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Événement introuvable</Text>
        </View>
      </View>
    );
  }

  const isCreatedByUser = event.createdBy === user?.id;
  const eventDate = new Date(event.date);

  // Calculer dynamiquement la participation
  const isParticipating = user ? event.participants.includes(user.id) : false;

  const handleDeleteEvent = () => {
    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteEvent(event.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleToggleParticipation = async () => {
    try {
      await toggleParticipation(event.id);

      // Feedback utilisateur
      const message = isParticipating
        ? 'Vous ne participez plus à cet événement'
        : 'Vous participez maintenant à cet événement';

      Alert.alert('Participation mise à jour', message);
    } catch (error) {
      console.error('Error toggling participation:', error);
      Alert.alert('Erreur', 'Impossible de modifier votre participation');
    }
  };

  const handleGetDirections = async () => {
    if (!event.location) return;

    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour calculer la distance');
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      const { latitude: userLat, longitude: userLng } = userLocation.coords;

      if (event.location.latitude && event.location.longitude) {
        const distance = calculateDistance(
          userLat,
          userLng,
          event.location.latitude,
          event.location.longitude
        );

        Alert.alert(
          'Distance',
          `Vous êtes à environ ${distance.toFixed(1)} km de l'événement`,
          [
            { text: 'OK' },
            {
              text: 'Ouvrir dans Maps',
              onPress: () => openInMaps(event.location!.latitude!, event.location!.longitude!, event.location!.name),
            },
          ]
        );
      } else {
        Alert.alert('Information', 'Les coordonnées exactes du lieu ne sont pas disponibles');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    } finally {
      setLoadingLocation(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const openInMaps = async (latitude: number, longitude: number, locationName: string) => {
    const destination = `${latitude},${longitude}`;
    const label = encodeURIComponent(locationName);

    let url = '';

    if (Platform.OS === 'ios') {
      // Essayer Apple Maps d'abord
      url = `maps://app?daddr=${destination}&dirflg=d`;
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        // Fallback vers Google Maps
        url = `https://maps.google.com/?daddr=${destination}&directionsmode=driving`;
      }
    } else {
      // Android - Google Maps
      url = `google.navigation:q=${destination}&mode=d`;
      const canOpen = await Linking.canOpenURL(url);

      if (!canOpen) {
        // Fallback vers navigateur
        url = `https://maps.google.com/?daddr=${destination}&directionsmode=driving`;
      }
    }

    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening maps:', error);
      Alert.alert('Erreur', 'Impossible d\'ouvrir l\'application de navigation');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.6}
        >
          <Text style={[styles.backButtonText, { color: colors.primary }]}>← Retour</Text>
        </TouchableOpacity>

        {isCreatedByUser && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteEvent}
            activeOpacity={0.6}
          >
            <Text style={[styles.deleteButtonText, { color: colors.error }]}>Supprimer</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>

          <View style={styles.dateTimeContainer}>
            <Text style={[styles.eventDate, { color: isParticipating ? colors.success : colors.primary }]}>
              📅 {eventDate.toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Text style={[styles.eventTime, { color: isParticipating ? colors.success : colors.primary }]}>🕒 {event.time}</Text>
          </View>

          {event.location && (
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <Text style={[styles.eventLocation, { color: colors.success }]}>📍 {event.location.name}</Text>
                {distance !== null && (
                  <Text style={[styles.distanceText, { color: colors.primary }]}>
                    à {distance.toFixed(1)} km
                  </Text>
                )}
              </View>

              {event.location.latitude && event.location.longitude && (
                <View style={styles.locationActions}>
                  <TouchableOpacity
                    style={[styles.directionsButton, {
                      backgroundColor: colors.success + '15',
                      borderColor: colors.success
                    }]}
                    onPress={handleGetDirections}
                    disabled={loadingLocation}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.directionsButtonText, { color: colors.success }]}>
                      {loadingLocation ? 'Calcul...' : 'Recalculer'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.directionsButton, {
                      backgroundColor: colors.primary + '15',
                      borderColor: colors.primary
                    }]}
                    onPress={() => openInMaps(event.location!.latitude!, event.location!.longitude!, event.location!.name)}
                    activeOpacity={0.6}
                  >
                    <Text style={[styles.directionsButtonText, { color: colors.primary }]}>
                      Ouvrir Maps
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Météo */}
          {weather && (
            <View style={styles.weatherContainer}>
              <Text style={[styles.weatherTitle, { color: colors.text }]}>Météo prévue</Text>
              <WeatherCard weather={weather} />
            </View>
          )}

          {loadingWeather && (
            <View style={styles.weatherContainer}>
              <Text style={[styles.weatherTitle, { color: colors.text }]}>Météo prévue</Text>
              <View style={[styles.loadingWeather, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <Text style={[styles.loadingText, { color: colors.textMuted }]}>Chargement de la météo...</Text>
              </View>
            </View>
          )}

          <View style={styles.descriptionContainer}>
            <Text style={[styles.descriptionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.eventDescription, { color: colors.textSecondary }]}>{event.description}</Text>
          </View>

          <View style={styles.participantsContainer}>
            <Text style={[styles.participantsTitle, { color: colors.text }]}>
              Participants ({event.participants.length})
            </Text>

            {event.participants.length === 0 ? (
              <Text style={[styles.noParticipantsText, { color: colors.textMuted }]}>
                Aucun participant pour le moment
              </Text>
            ) : (
              <View style={styles.participantsList}>
                {event.participants.map((participantId, index) => (
                  <View key={participantId} style={[styles.participantItem, {
                    backgroundColor: colors.background,
                    borderLeftColor: colors.primary
                  }]}>
                    <Text style={[styles.participantText, { color: colors.text }]}>
                      Participant {index + 1}
                      {participantId === user?.id && ' (Vous)'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={[styles.creatorInfo, { borderTopColor: colors.borderLight }]}>
            <Text style={[styles.creatorText, { color: colors.textMuted }]}>
              Créé par {isCreatedByUser ? 'vous' : 'un autre utilisateur'}
            </Text>
            <Text style={[styles.createdDate, { color: colors.textMuted }]}>
              Le {new Date(event.createdAt).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        </View>

        {isCreatedByUser ? (
          <TouchableOpacity
            style={[
              styles.participateButton,
              { backgroundColor: colors.warning },
            ]}
            onPress={() => router.push(`/edit-event/${event.id}`)}
            activeOpacity={0.6}
          >
            <Text style={styles.participateButtonText}>
              Modifier l'événement
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.participateButton,
              { backgroundColor: isParticipating ? colors.error : colors.primary },
            ]}
            onPress={handleToggleParticipation}
            activeOpacity={0.6}
          >
            <Text style={styles.participateButtonText}>
              {isParticipating ? 'Ne plus participer' : 'Participer à cet événement'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
  },
  backButton: {
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
  },
  deleteButton: {
    paddingVertical: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: Typography.fontSize.base,
  },
  content: {
    flex: 1,
  },
  eventCard: {
    margin: Spacing.md,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    borderWidth: 0.5,
    ...Shadows.md,
  },
  eventTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  dateTimeContainer: {
    marginBottom: Spacing.md,
  },
  eventDate: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  eventTime: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  locationContainer: {
    marginBottom: Spacing.md,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventLocation: {
    fontSize: Typography.fontSize.base,
    flex: 1,
  },
  distanceText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: 'rgba(255, 133, 0, 0.1)',
    borderRadius: BorderRadius.xs,
  },
  locationActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  directionsButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    minHeight: 36,
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  directionsButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  descriptionContainer: {
    marginBottom: Spacing.lg,
  },
  descriptionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  eventDescription: {
    fontSize: Typography.fontSize.base,
    lineHeight: 24,
  },
  participantsContainer: {
    marginBottom: Spacing.lg,
  },
  participantsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  noParticipantsText: {
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
  },
  participantsList: {
    gap: Spacing.sm,
  },
  participantItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    borderLeftWidth: 3,
  },
  participantText: {
    fontSize: Typography.fontSize.sm,
  },
  creatorInfo: {
    borderTopWidth: 0.5,
    paddingTop: Spacing.md,
  },
  creatorText: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  createdDate: {
    fontSize: Typography.fontSize.xs,
  },
  participateButton: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  participateButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Typography.fontSize.lg,
  },
  weatherContainer: {
    marginBottom: Spacing.lg,
  },
  weatherTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  loadingWeather: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 0.5,
    alignItems: 'center',
    ...Shadows.sm,
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
  },
});