import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { Event } from '@/types';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

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
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  if (isCreatedByUser) {
    return (
      <TouchableOpacity
        style={[styles.participateButton, { backgroundColor: colors.warning }]}
        onPress={() => router.push(`/edit-event/${event.id}`)}
        activeOpacity={0.8}
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
      activeOpacity={0.8}
    >
      <Text style={styles.participateButtonText}>
        {isParticipating ? 'Ne plus participer' : 'Participer à cet événement'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  participateButton: {
    marginHorizontal: 20,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
    ...Shadows.md,
  },
  participateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});