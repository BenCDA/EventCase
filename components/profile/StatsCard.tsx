import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface StatsCardProps {
  createdCount: number;
  participatingCount: number;
}

export function StatsCard({ createdCount, participatingCount }: StatsCardProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>{createdCount}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Créés</Text>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.borderLight }]} />
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>{participatingCount}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Participations</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: Spacing.md,
  },
});