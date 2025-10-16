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
      label: 'Clair',
      icon: 'sunny',
      description: 'Thème lumineux'
    },
    {
      mode: 'dark' as const,
      label: 'Sombre',
      icon: 'moon',
      description: 'Thème sombre'
    },
    {
      mode: 'system' as const,
      label: 'Système',
      icon: 'phone-portrait',
      description: 'Suit le système'
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
      <View style={styles.header}>
        <Ionicons name="color-palette" size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>Apparence</Text>
      </View>

      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => {
          const isSelected = themeMode === option.mode;
          return (
            <TouchableOpacity
              key={option.mode}
              style={[
                styles.option,
                {
                  backgroundColor: colors.background,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                }
              ]}
              onPress={() => setThemeMode(option.mode)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconContainer,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                }
              ]}>
                <Ionicons
                  name={option.icon}
                  size={24}
                  color={isSelected ? '#FFFFFF' : colors.text}
                />
              </View>

              <View style={styles.textContainer}>
                <Text style={[
                  styles.optionLabel,
                  {
                    color: colors.text,
                    fontWeight: isSelected ? '600' : '500',
                  }
                ]}>
                  {option.label}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textMuted }]}>
                  {option.description}
                </Text>
              </View>

              {isSelected && (
                <View style={styles.checkContainer}>
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                  />
                </View>
              )}
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
    ...Shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: Typography.fontSize.base,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
  },
  checkContainer: {
    marginLeft: Spacing.sm,
  },
});