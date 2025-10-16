import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Beautiful Orange primary
    primary: '#FF8500',
    primaryDark: '#E6750A',
    // Apple Green
    secondary: '#30D158',
    // Apple Blue for info
    accent: '#007AFF',

    // Apple backgrounds
    background: '#F2F2F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',

    // Apple text colors
    text: '#000000',
    textSecondary: '#3C3C43',
    textMuted: '#8E8E93',

    // Apple borders
    border: '#C6C6C8',
    borderLight: '#E5E5EA',

    // Apple system colors
    success: '#30D158',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',

    // Orange gradient
    gradient: ['#FF8500', '#FF9F0A'],
    shadowColor: '#000000',

    tint: '#FF8500',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#FF8500',
  },
  dark: {
    // Orange dark mode
    primary: '#FF9F0A',
    primaryDark: '#FF8500',
    // Apple Green dark
    secondary: '#30D158',
    // Apple Blue dark
    accent: '#64D2FF',

    // Apple dark backgrounds
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',

    // Apple dark text
    text: '#FFFFFF',
    textSecondary: '#EBEBF5',
    textMuted: '#8E8E93',

    // Apple dark borders
    border: '#38383A',
    borderLight: '#48484A',

    // Apple dark system colors
    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#64D2FF',

    gradient: ['#FF9F0A', '#FFAD33'],
    shadowColor: '#000000',

    tint: '#FF9F0A',
    tabIconDefault: '#8E8E93',
    tabIconSelected: '#FF9F0A',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  // Micro-spacing pour des ajustements précis
  micro: 2,
  tiny: 6,
  base: 12,
  large: 20,
  huge: 40,
};

export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 9999,
};

export const Typography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const Shadows = {
  // Ombres ultra-subtiles niveau GAFAM
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0.5 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 0.5,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  // Ombre pour boutons flottants
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const Animations = {
  quick: 200,
  normal: 300,
  slow: 500,

  spring: {
    damping: 20,
    stiffness: 300,
  },

  easeInOut: {
    duration: 300,
    useNativeDriver: true,
  },
};

export const HapticFeedback = {
  light: 'light',
  medium: 'medium',
  heavy: 'heavy',
  success: 'success',
  warning: 'warning',
  error: 'error',
} as const;
