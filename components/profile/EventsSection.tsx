import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Event } from '@/types';
import { EventListItem } from './EventListItem';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface EventsSectionProps {
  title: string;
  events: Event[];
  emptyIcon: string;
  emptyText: string;
  showCreateButton?: boolean;
}

export function EventsSection({
  title,
  events,
  emptyIcon,
  emptyText,
  showCreateButton = false
}: EventsSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>{emptyIcon}</Text>
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            {emptyText}
          </Text>
          {showCreateButton && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/add-event' as any)}
              activeOpacity={0.6}
            >
              <Text style={styles.createButtonText}>Créer un événement</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View style={styles.eventsList}>
          {events.slice(0, 3).map((event, index) => (
            <EventListItem
              key={event.id}
              event={event}
              isLast={index === events.slice(0, 3).length - 1}
            />
          ))}

          {events.length > 3 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              activeOpacity={0.6}
            >
              <Text style={[styles.showMoreText, { color: colors.primary }]}>
                Voir tous ({events.length})
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    padding: Spacing.md,
    paddingBottom: 0,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  createButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  eventsList: {},
  showMoreButton: {
    padding: Spacing.md,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});