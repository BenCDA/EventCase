import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface AppleHeaderProps {
  title: string;
  rightButton?: {
    text: string;
    onPress: () => void;
  };
  leftButton?: {
    text: string;
    onPress: () => void;
  };
}

export function AppleHeader({ title, rightButton, leftButton }: AppleHeaderProps) {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.md,
          backgroundColor: colors.background,
          borderBottomColor: colors.borderLight,
        }
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftButton && (
            <TouchableOpacity
              style={styles.button}
              onPress={leftButton.onPress}
            >
              <Text style={[styles.buttonText, { color: colors.primary }]}>
                {leftButton.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <View style={styles.rightSection}>
          {rightButton && (
            <TouchableOpacity
              style={styles.button}
              onPress={rightButton.onPress}
            >
              <Text style={[styles.rightButtonText, { color: colors.primary }]}>
                {rightButton.text}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    minHeight: 44, // Apple standard height
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1.2,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    flex: 1.5,
    textAlign: 'center',
  },
  button: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
  },
  rightButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
});