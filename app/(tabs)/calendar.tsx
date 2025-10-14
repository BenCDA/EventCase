import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEvents } from '@/contexts/EventContext';
import { Event } from '@/types';
import { AppleHeader } from '@/components/AppleHeader';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

export default function CalendarScreen() {
  const { events } = useEvents();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const markedDates = useMemo(() => {
    const marked: any = {};

    events.forEach((event) => {
      const dateKey = event.date;
      if (!marked[dateKey]) {
        marked[dateKey] = {
          marked: true,
          dots: [],
        };
      }

      marked[dateKey].dots.push({
        key: event.id,
        color: event.isParticipating ? colors.success : colors.primary,
      });
    });

    return marked;
  }, [events, colors]);

  const [selectedDate, setSelectedDate] = React.useState<string>('');
  const [showQuickActions, setShowQuickActions] = React.useState<boolean>(false);

  const eventsForSelectedDate = useMemo(() => {
    return events.filter(event => event.date === selectedDate);
  }, [events, selectedDate]);

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setShowQuickActions(true);
  };

  const handleAddEventForDate = () => {
    setShowQuickActions(false);
    router.push({
      pathname: '/add-event',
      params: { selectedDate: selectedDate }
    } as any);
  };

  const handleEventPress = (event: Event) => {
    router.push(`/event-details/${event.id}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppleHeader
        title="Calendrier"
        rightButton={{
          text: "Ajouter",
          onPress: () => router.push('/add-event' as any)
        }}
      />

      <View style={[styles.calendarContainer, { backgroundColor: colors.surface }]}>
        <Calendar
          style={styles.calendar}
          markingType={'multi-dot'}
          markedDates={markedDates}
          onDayPress={onDayPress}
          theme={{
            backgroundColor: colors.surface,
            calendarBackground: colors.surface,
            textSectionTitleColor: colors.textMuted,
            selectedDayBackgroundColor: colors.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.primary,
            dayTextColor: colors.text,
            textDisabledColor: colors.textMuted,
            dotColor: colors.primary,
            selectedDotColor: '#ffffff',
            arrowColor: colors.primary,
            monthTextColor: colors.text,
            indicatorColor: colors.primary,
            textDayFontWeight: Typography.fontWeight.medium,
            textMonthFontWeight: Typography.fontWeight.bold,
            textDayHeaderFontWeight: Typography.fontWeight.semibold,
            textDayFontSize: Typography.fontSize.base,
            textMonthFontSize: Typography.fontSize.lg,
            textDayHeaderFontSize: Typography.fontSize.sm,
          }}
        />

        <View style={[styles.legendContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Disponible</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Participant</Text>
          </View>
        </View>
      </View>

      {selectedDate ? (
        <View style={styles.eventsContainer}>
          <View style={styles.eventsSectionHeader}>
            <Text style={[styles.eventsTitle, { color: colors.text }]}>
              Événements du {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>

            {showQuickActions && (
              <View style={styles.quickActionsContainer}>
                <TouchableOpacity
                  style={[styles.quickActionButton, { backgroundColor: colors.primary }]}
                  onPress={handleAddEventForDate}
                  activeOpacity={0.6}
                >
                  <Text style={styles.quickActionText}>➕ Ajouter un événement</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.quickActionButton, styles.cancelButton, { backgroundColor: colors.textMuted + '20', borderColor: colors.textMuted }]}
                  onPress={() => setShowQuickActions(false)}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.quickActionText, { color: colors.textMuted }]}>Annuler</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <ScrollView style={styles.eventsList} showsVerticalScrollIndicator={false}>
            {eventsForSelectedDate.length === 0 ? (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsIcon}>📅</Text>
                <Text style={[styles.noEventsText, { color: colors.textMuted }]}>
                  Aucun événement ce jour
                </Text>
              </View>
            ) : (
              eventsForSelectedDate.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.eventItem, { backgroundColor: colors.surface }, Shadows.sm]}
                  onPress={() => handleEventPress(event)}
                  activeOpacity={0.7}
                >
                  <View style={styles.eventHeader}>
                    <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                    <View style={[styles.timeContainer, { backgroundColor: colors.primary }]}>
                      <Text style={styles.eventTime}>{event.time}</Text>
                    </View>
                  </View>

                  <Text style={[styles.eventDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {event.description}
                  </Text>

                  {event.location && (
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Text style={[styles.eventLocation, { color: colors.success }]}>{event.location.name}</Text>
                    </View>
                  )}

                  <View style={styles.eventFooter}>
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
              ))
            )}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.selectDateContainer}>
          <Text style={styles.selectDateIcon}>🗓️</Text>
          <Text style={[styles.selectDateText, { color: colors.textSecondary }]}>
            Sélectionnez une date pour voir les événements
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendarContainer: {
    borderRadius: BorderRadius.md,
    margin: Spacing.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  calendar: {
    paddingBottom: Spacing.sm,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  eventsContainer: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  eventsTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
    textAlign: 'center',
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
  eventItem: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 0.5,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  eventTitle: {
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
  eventTime: {
    fontSize: Typography.fontSize.xs,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
  },
  eventDescription: {
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
  eventLocation: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  eventFooter: {
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
  selectDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  selectDateIcon: {
    fontSize: 64,
    marginBottom: Spacing.lg,
  },
  selectDateText: {
    fontSize: Typography.fontSize.lg,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  eventsSectionHeader: {
    marginBottom: Spacing.md,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  quickActionButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  cancelButton: {
    borderWidth: 1,
  },
  quickActionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
});