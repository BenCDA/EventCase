import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';

interface DateTimeSelectorProps {
  date: Date;
  time: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

export function DateTimeSelector({
  date,
  time,
  onDateChange,
  onTimeChange,
}: DateTimeSelectorProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Sélectionner l\'heure';
    return timeString;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      onTimeChange(`${hours}:${minutes}`);
    }
  };

  const closeDatePicker = () => setShowDatePicker(false);
  const closeTimePicker = () => setShowTimePicker(false);

  const getTimeValue = () => {
    if (!time) return new Date();
    const [hours, minutes] = time.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes));
    return timeDate;
  };

  if (Platform.OS === 'ios') {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.dateButton,
              { backgroundColor: colors.surface, borderColor: colors.borderLight }
            ]}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="calendar-outline" size={28} color={colors.primary} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.timeButton,
              { backgroundColor: colors.surface, borderColor: colors.borderLight }
            ]}
            onPress={() => setShowTimePicker(true)}
            activeOpacity={0.7}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="time-outline" size={28} color={colors.primary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal pour iOS */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={[styles.modalButton, { color: colors.textSecondary }]}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Sélectionner la date
                </Text>
                <TouchableOpacity onPress={closeDatePicker}>
                  <Text style={[styles.modalButton, { color: colors.primary }]}>
                    Terminé
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                minimumDate={new Date()}
                locale="fr-FR"
                themeVariant={colorScheme}
              />
            </View>
          </View>
        </Modal>

        <Modal
          visible={showTimePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={closeTimePicker}>
                  <Text style={[styles.modalButton, { color: colors.textSecondary }]}>
                    Annuler
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Sélectionner l'heure
                </Text>
                <TouchableOpacity onPress={closeTimePicker}>
                  <Text style={[styles.modalButton, { color: colors.primary }]}>
                    Terminé
                  </Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={getTimeValue()}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                locale="fr-FR"
                themeVariant={colorScheme}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Android version
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            { backgroundColor: colors.surface, borderColor: colors.borderLight }
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="calendar-outline" size={28} color={colors.primary} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.timeButton,
            { backgroundColor: colors.surface, borderColor: colors.borderLight }
          ]}
          onPress={() => setShowTimePicker(true)}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="time-outline" size={28} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={getTimeValue()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
  },
  dateButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  timeButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  buttonContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    paddingBottom: 34, // Safe area
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  modalButton: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});