import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Spacing, Typography } from '@/constants/theme';

export function CalendarLegend() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
        <Text style={[styles.text, { color: colors.textSecondary }]}>Disponible</Text>
      </View>
      <View style={styles.item}>
        <View style={[styles.dot, { backgroundColor: colors.success }]} />
        <Text style={[styles.text, { color: colors.textSecondary }]}>Participant</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.lg,
    borderTopWidth: 0.5,
    borderTopColor: '#E5E5EA',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
});