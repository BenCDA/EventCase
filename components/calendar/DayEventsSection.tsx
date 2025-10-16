import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Event } from '@/types';
import { EventDayCard } from './EventDayCard';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface DayEventsSectionProps {
  selectedDate: string;
  events: Event[];
  showQuickActions: boolean;
  fadeAnim: Animated.Value;
  onEventPress: (event: Event) => void;
  onAddEventPress: () => void;
  onToggleQuickActions: () => void;
  onHideQuickActions: () => void;
}

export function DayEventsSection({
  selectedDate,
  events,
  showQuickActions,
  fadeAnim,
  onEventPress,
  onAddEventPress,
  onToggleQuickActions,
  onHideQuickActions,
}: DayEventsSectionProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Événements du {formatDate(selectedDate)}
        </Text>

        {showQuickActions && (
          <Animated.View style={[
            styles.quickActionsContainer,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0]
                })
              }]
            }
          ]}>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={onAddEventPress}
              activeOpacity={0.7}
            >
              <Text style={styles.addButtonText}>+ Nouvel événement</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      <ScrollView
        style={styles.eventsList}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onHideQuickActions}
      >
        {events.length === 0 ? (
          <TouchableOpacity
            style={styles.noEventsContainer}
            onPress={onToggleQuickActions}
            activeOpacity={0.6}
          >
            <Text style={styles.noEventsIcon}>📅</Text>
            <Text style={[styles.noEventsText, { color: colors.textMuted }]}>
              Aucun événement ce jour
            </Text>
            {!showQuickActions && (
              <Text style={[styles.tapToAddText, { color: colors.primary }]}>
                Touchez pour ajouter un événement
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          events.map((event) => (
            <EventDayCard
              key={event.id}
              event={event}
              onPress={() => onEventPress(event)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  quickActionsContainer: {
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  addButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  eventsList: {
    flex: 1,
  },
  noEventsContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  noEventsIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  noEventsText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
  tapToAddText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});