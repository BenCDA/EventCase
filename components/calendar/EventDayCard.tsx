import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Event } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface EventDayCardProps {
  event: Event;
  onPress: () => void;
}

export function EventDayCard({ event, onPress }: EventDayCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.surface }, Shadows.sm]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
        <View style={[styles.timeContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.time}>{event.time}</Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
        {event.description}
      </Text>

      {event.location && (
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={[styles.location, { color: colors.success }]}>{event.location.name}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={[styles.participantCount, { color: colors.textMuted }]}>
          {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
        </Text>

        {event.isParticipating && (
          <View style={[styles.participatingBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.participatingBadgeText}>✓ Vous participez</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  timeContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  time: {
    fontSize: Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationIcon: {
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.xs,
  },
  location: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantCount: {
    fontSize: Typography.fontSize.xs,
  },
  participatingBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  participatingBadgeText: {
    fontSize: Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
  },
});