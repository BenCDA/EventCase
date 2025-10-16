import { useMemo } from 'react';
import { Event } from '@/types';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export function useCalendarData(events: Event[]) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const markedDates = useMemo(() => {
    const marked: any = {};

    events.forEach((event) => {
      const dateKey = event.date;
      if (!marked[dateKey]) {
        marked[dateKey] = {
          marked: true,
          dots: [],
        };
      }

      marked[dateKey].dots.push({
        key: event.id,
        color: event.isParticipating ? colors.success : colors.primary,
      });
    });

    return marked;
  }, [events, colors]);

  const getEventsForDate = useMemo(() => {
    return (selectedDate: string) => events.filter(event => event.date === selectedDate);
  }, [events]);

  return {
    markedDates,
    getEventsForDate,
  };
}