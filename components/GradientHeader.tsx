import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface GradientHeaderProps {
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

export function GradientHeader({ title, rightButton, leftButton }: GradientHeaderProps) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <LinearGradient
      colors={colors.gradient}
      style={[styles.container, { paddingTop: insets.top + Spacing.md }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {leftButton && (
            <TouchableOpacity
              style={styles.button}
              onPress={leftButton.onPress}
            >
              <Text style={styles.buttonText}>{leftButton.text}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.title}>{title}</Text>

        <View style={styles.rightSection}>
          {rightButton && (
            <TouchableOpacity
              style={[styles.button, styles.rightButton]}
              onPress={rightButton.onPress}
            >
              <Text style={styles.rightButtonText}>{rightButton.text}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#FFFFFF',
    flex: 2,
    textAlign: 'center',
  },
  button: {
    paddingVertical: Spacing.sm,
  },
  rightButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: Typography.fontSize.base,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.medium,
  },
  rightButtonText: {
    fontSize: Typography.fontSize.sm,
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
  },
});