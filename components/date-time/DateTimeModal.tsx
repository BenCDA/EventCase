import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';

interface DateTimeModalProps {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  title: string;
  onClose: () => void;
  onChange: (event: any, selectedDate?: Date) => void;
}

export function DateTimeModal({
  visible,
  mode,
  value,
  title,
  onClose,
  onChange
}: DateTimeModalProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  if (Platform.OS === 'android') {
    return null; // Android uses native picker
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.button, { color: colors.textSecondary }]}>
                Annuler
              </Text>
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={[styles.button, { color: colors.primary }]}>
                Terminé
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={value}
            mode={mode}
            display="spinner"
            onChange={onChange}
            minimumDate={mode === 'date' ? new Date() : undefined}
            locale="fr-FR"
            themeVariant={colorScheme}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingBottom: 34, // Safe area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  button: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});