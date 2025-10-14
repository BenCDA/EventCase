import React, { useRef } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { Animations } from '@/constants/theme';

interface AnimatedTouchableProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scaleValue?: number;
  onPress?: () => void;
}

export function AnimatedTouchable({
  children,
  scaleValue = 0.95,
  onPress,
  style,
  ...props
}: AnimatedTouchableProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: scaleValue,
      duration: Animations.quick,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: Animations.quick,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    if (onPress) {
      // Petit délai pour voir l'animation de press
      setTimeout(() => {
        onPress();
      }, 50);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      style={style}
      {...props}
    >
      <Animated.View
        style={[
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}