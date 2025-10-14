import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface EventEaseLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  variant?: 'default' | 'minimal';
}

export function EventEaseLogo({
  size = 'medium',
  showText = true,
  variant = 'default'
}: EventEaseLogoProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getSizes = () => {
    switch (size) {
      case 'small':
        return { iconSize: 24, fontSize: Typography.fontSize.base, containerSize: 40 };
      case 'medium':
        return { iconSize: 32, fontSize: Typography.fontSize.xl, containerSize: 56 };
      case 'large':
        return { iconSize: 48, fontSize: Typography.fontSize['3xl'], containerSize: 80 };
      default:
        return { iconSize: 32, fontSize: Typography.fontSize.xl, containerSize: 56 };
    }
  };

  const sizes = getSizes();

  if (variant === 'minimal') {
    return (
      <View style={styles.minimalContainer}>
        <View style={[
          styles.iconContainer,
          {
            backgroundColor: colors.primary,
            width: sizes.containerSize,
            height: sizes.containerSize,
          }
        ]}>
          <Ionicons
            name="calendar"
            size={sizes.iconSize}
            color="#FFFFFF"
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[
        styles.logoContainer,
        {
          backgroundColor: colors.primary,
          width: sizes.containerSize,
          height: sizes.containerSize,
        }
      ]}>
        <View style={styles.iconBackground}>
          <Ionicons
            name="calendar"
            size={sizes.iconSize * 0.7}
            color="#FFFFFF"
          />
        </View>
        <View style={[styles.accentDot, { backgroundColor: colors.secondary }]} />
      </View>

      {showText && (
        <Text style={[
          styles.logoText,
          {
            color: colors.primary,
            fontSize: sizes.fontSize,
          }
        ]}>
          Event<Text style={[styles.logoTextAccent, { color: colors.secondary }]}>Ease</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  minimalContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#FF8500',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  iconContainer: {
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBackground: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  accentDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  logoText: {
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  logoTextAccent: {
    fontWeight: Typography.fontWeight.extrabold,
  },
});