import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Event } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface EventMainCardProps {
  event: Event;
}

export function EventMainCard({ event }: EventMainCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const eventDate = new Date(event.date);

  return (
    <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>

      <View style={styles.dateTimeContainer}>
        <View style={styles.dateTimeRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {eventDate.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </Text>
        </View>
        <View style={styles.dateTimeRow}>
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={[styles.timeText, { color: colors.primary }]}>{event.time}</Text>
        </View>
      </View>

      <Text style={[styles.description, { color: colors.textSecondary }]}>{event.description}</Text>
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
  eventTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  dateTimeContainer: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  timeText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  description: {
    fontSize: Typography.fontSize.base,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
});