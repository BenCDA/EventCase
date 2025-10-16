import { useState, useEffect, useRef } from 'react';
import { Platform, Animated } from 'react-native';

export function useDateTimePicker() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date, onDateChange?: (date: Date) => void) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate && onDateChange) {
      onDateChange(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date, onTimeChange?: (time: string) => void) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime && onTimeChange) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      onTimeChange(`${hours}:${minutes}`);
    }
  };

  const getTimeValue = (time: string) => {
    if (!time) return new Date();
    const [hours, minutes] = time.split(':');
    const timeDate = new Date();
    timeDate.setHours(parseInt(hours), parseInt(minutes));
    return timeDate;
  };

  return {
    showDatePicker,
    showTimePicker,
    setShowDatePicker,
    setShowTimePicker,
    handleDateChange,
    handleTimeChange,
    getTimeValue,
  };
}