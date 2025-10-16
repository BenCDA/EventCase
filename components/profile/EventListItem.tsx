import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Event } from '@/types';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface EventListItemProps {
  event: Event;
  isLast?: boolean;
}

export function EventListItem({ event, isLast }: EventListItemProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const handlePress = () => {
    router.push(`/event-details/${event.id}` as any);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { borderColor: colors.borderLight },
        isLast && styles.lastItem
      ]}
      onPress={handlePress}
      activeOpacity={0.6}
    >
      <Text style={[styles.title, { color: colors.text }]}>{event.title}</Text>
      <Text style={[styles.date, { color: colors.primary }]}>
        {new Date(event.date).toLocaleDateString('fr-FR')} • {event.time}
      </Text>
      <Text style={[styles.participantCount, { color: colors.textMuted }]}>
        {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderBottomWidth: 0.5,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  date: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  participantCount: {
    fontSize: Typography.fontSize.sm,
  },
});