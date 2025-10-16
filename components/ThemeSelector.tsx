import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

export function ThemeSelector() {
  const { colorScheme, themeMode, setThemeMode } = useTheme();
  const colors = Colors[colorScheme];

  const themeOptions = [
    {
      mode: 'light' as const,
      icon: 'sunny'
    },
    {
      mode: 'dark' as const,
      icon: 'moon'
    },
    {
      mode: 'system' as const,
      icon: 'phone-portrait'
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={styles.header}>
        <Ionicons name="color-palette-outline" size={18} color={colors.textSecondary} />
        <Text style={[styles.title, { color: colors.text }]}>Apparence</Text>
      </View>

      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => {
          const isSelected = themeMode === option.mode;
          return (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.optionButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  borderColor: isSelected ? colors.primary : colors.borderLight,
                }
              ]}
              onPress={() => setThemeMode(option.mode)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={option.icon}
                size={20}
                color={isSelected ? '#FFFFFF' : colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    padding: Spacing.lg,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'center',
  },
  optionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    ...Shadows.xs,
  },
});