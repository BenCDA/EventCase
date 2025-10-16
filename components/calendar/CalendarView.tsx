import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface CalendarViewProps {
  markedDates: any;
  onDayPress: (day: any) => void;
}

export function CalendarView({ markedDates, onDayPress }: CalendarViewProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    margin: Spacing.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E5EA',
  },
  calendar: {
    paddingBottom: Spacing.sm,
  },
});