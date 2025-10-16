import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors, Spacing } from '@/constants/theme';

interface ThemeToggleProps {
  size?: number;
  style?: any;
}

export function ThemeToggle({ size = 24, style }: ThemeToggleProps) {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = Colors[colorScheme];

  const iconName = colorScheme === 'light' ? 'moon-outline' : 'sunny-outline';

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: colors.border }, style]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <Ionicons
        name={iconName}
        size={size}
        color={colors.text}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});