import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Spacing, Typography } from '@/constants/theme';

interface EventDetailsHeaderProps {
  isCreatedByUser: boolean;
  onDeleteEvent: () => void;
}

export function EventDetailsHeader({ isCreatedByUser, onDeleteEvent }: EventDetailsHeaderProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.header,
      {
        paddingTop: insets.top + 12,
        backgroundColor: colors.surface,
        borderBottomColor: colors.borderLight
      }
    ]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.6}
      >
        <Text style={[styles.backButtonText, { color: colors.primary }]}>← Retour</Text>
      </TouchableOpacity>

      {isCreatedByUser && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={onDeleteEvent}
          activeOpacity={0.6}
        >
          <Text style={[styles.deleteButtonText, { color: colors.error }]}>Supprimer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
  },
  backButton: {
    paddingVertical: Spacing.sm,
  },
  backButtonText: {
    fontSize: Typography.fontSize.base,
  },
  deleteButton: {
    paddingVertical: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: Typography.fontSize.base,
  },
});