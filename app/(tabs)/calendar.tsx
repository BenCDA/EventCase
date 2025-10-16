import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useEvents } from '@/contexts/EventContext';
import { Event } from '@/types';
import { AppleHeader } from '@/components/AppleHeader';
import { CalendarView, CalendarLegend, DayEventsSection } from '@/components/calendar';
import { useCalendarData } from '@/hooks/useCalendarData';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function CalendarScreen() {
  const { events } = useEvents();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { markedDates, getEventsForDate } = useCalendarData(events);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showQuickActions, setShowQuickActions] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const eventsForSelectedDate = getEventsForDate(selectedDate);

  useEffect(() => {
    if (showQuickActions) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [showQuickActions, fadeAnim]);

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

      <CalendarView markedDates={markedDates} onDayPress={onDayPress} />
      <CalendarLegend />

      {selectedDate ? (
        <DayEventsSection
          selectedDate={selectedDate}
          events={eventsForSelectedDate}
          showQuickActions={showQuickActions}
          fadeAnim={fadeAnim}
          onEventPress={handleEventPress}
          onAddEventPress={handleAddEventForDate}
          onToggleQuickActions={() => setShowQuickActions(true)}
          onHideQuickActions={() => setShowQuickActions(false)}
        />
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
});