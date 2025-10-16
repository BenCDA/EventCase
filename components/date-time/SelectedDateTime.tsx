import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface SelectedDateTimeProps {
  date: Date;
  time: string;
}

export function SelectedDateTime({ date, time }: SelectedDateTimeProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Heure non sélectionnée';
    return timeString;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateTimeRow}>
        <Text style={[styles.dateText, { color: colors.text }]}>
          {formatDate(date)}
        </Text>
        {time && (
          <>
            <Text style={[styles.separator, { color: colors.textMuted }]}>•</Text>
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {formatTime(time)}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dateText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  separator: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  timeText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
});