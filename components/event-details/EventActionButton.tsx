import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Event } from '@/types';
import { Colors, Spacing, Typography, BorderRadius } from '@/constants/theme';

interface EventActionButtonProps {
  event: Event;
  isCreatedByUser: boolean;
  isParticipating: boolean;
  onToggleParticipation: () => void;
}

export function EventActionButton({
  event,
  isCreatedByUser,
  isParticipating,
  onToggleParticipation
}: EventActionButtonProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  if (isCreatedByUser) {
    return (
      <TouchableOpacity
        style={[styles.participateButton, { backgroundColor: colors.warning }]}
        onPress={() => router.push(`/edit-event/${event.id}`)}
        activeOpacity={0.6}
      >
        <Text style={styles.participateButtonText}>Modifier l'événement</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.participateButton,
        { backgroundColor: isParticipating ? colors.error : colors.primary },
      ]}
      onPress={onToggleParticipation}
      activeOpacity={0.6}
    >
      <Text style={styles.participateButtonText}>
        {isParticipating ? 'Ne plus participer' : 'Participer à cet événement'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  participateButton: {
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  participateButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
});