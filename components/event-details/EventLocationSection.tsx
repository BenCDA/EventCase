import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Event } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface EventLocationSectionProps {
  event: Event;
  distance: number | null;
}

export function EventLocationSection({ event, distance }: EventLocationSectionProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

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

  if (!event.location) {
    return null;
  }

  return (
    <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="location-outline" size={18} color={colors.success} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Lieu</Text>
      </View>

      <Text style={[styles.locationName, { color: colors.textSecondary }]}>
        {event.location.name}
      </Text>

      {distance !== null && (
        <Text style={[styles.distanceText, { color: colors.primary }]}>
          À {distance.toFixed(1)} km de vous
        </Text>
      )}

      {event.location.latitude && event.location.longitude && (
        <TouchableOpacity
          style={[styles.actionLink, { borderColor: colors.primary }]}
          onPress={() => openInMaps(event.location!.latitude!, event.location!.longitude!, event.location!.name)}
          activeOpacity={0.6}
        >
          <Ionicons name="map-outline" size={16} color={colors.primary} />
          <Text style={[styles.actionLinkText, { color: colors.primary }]}>Ouvrir dans Plans</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: 'white',
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginVertical: Spacing.sm,
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
  locationName: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.sm,
  },
  distanceText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.md,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  actionLinkText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
});