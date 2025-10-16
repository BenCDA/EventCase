import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { DateTimeButton, DateTimeModal, SelectedDateTime } from './date-time';
import { useDateTimePicker } from '@/hooks/useDateTimePicker';

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
  const {
    showDatePicker,
    showTimePicker,
    setShowDatePicker,
    setShowTimePicker,
    handleDateChange,
    handleTimeChange,
    getTimeValue,
  } = useDateTimePicker();

  const onDatePickerChange = (event: any, selectedDate?: Date) => {
    handleDateChange(event, selectedDate, onDateChange);
  };

  const onTimePickerChange = (event: any, selectedTime?: Date) => {
    handleTimeChange(event, selectedTime, onTimeChange);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <DateTimeButton
          iconName="calendar-outline"
          onPress={() => setShowDatePicker(true)}
        />
        <DateTimeButton
          iconName="time-outline"
          onPress={() => setShowTimePicker(true)}
        />
      </View>

      <SelectedDateTime date={date} time={time} />

      {Platform.OS === 'ios' ? (
        <>
          <DateTimeModal
            visible={showDatePicker}
            mode="date"
            value={date}
            title="Sélectionner la date"
            onClose={() => setShowDatePicker(false)}
            onChange={onDatePickerChange}
          />
          <DateTimeModal
            visible={showTimePicker}
            mode="time"
            value={getTimeValue(time)}
            title="Sélectionner l'heure"
            onClose={() => setShowTimePicker(false)}
            onChange={onTimePickerChange}
          />
        </>
      ) : (
        <>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onDatePickerChange}
              minimumDate={new Date()}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={getTimeValue(time)}
              mode="time"
              display="default"
              onChange={onTimePickerChange}
            />
          )}
        </>
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
});