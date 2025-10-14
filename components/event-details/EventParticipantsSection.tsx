import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Event } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

interface EventParticipantsSectionProps {
  event: Event;
  isParticipating: boolean;
}

export function EventParticipantsSection({ event, isParticipating }: EventParticipantsSectionProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={styles.sectionHeader}>
        <Ionicons name="people-outline" size={18} color={colors.warning} />
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Participants ({event.participants.length})
        </Text>
      </View>

      {event.participants.length === 0 ? (
        <Text style={[styles.noParticipants, { color: colors.textMuted }]}>
          Aucun participant pour le moment
        </Text>
      ) : (
        <View style={styles.participantsList}>
          {isParticipating && (
            <View style={[styles.participantBadge, { backgroundColor: colors.success + '15' }]}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.participantBadgeText, { color: colors.success }]}>
                Vous participez
              </Text>
            </View>
          )}
        </View>
      )}
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  noParticipants: {
    fontSize: Typography.fontSize.base,
    fontStyle: 'italic',
  },
  participantsList: {
    gap: Spacing.sm,
  },
  participantBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  participantBadgeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
});