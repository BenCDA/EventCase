import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { EventContextType, Event } from '@/types';
import { StorageService } from '@/services/storage';
import { useAuth } from './AuthContext';

interface EventState {
  events: Event[];
  loading: boolean;
}

type EventAction =
  | { type: 'SET_EVENTS'; payload: Event[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_EVENT'; payload: Event }
  | { type: 'UPDATE_EVENT'; payload: { id: string; event: Partial<Event> } }
  | { type: 'DELETE_EVENT'; payload: string }
  | { type: 'TOGGLE_PARTICIPATION'; payload: { eventId: string; userId: string } };

const eventReducer = (state: EventState, action: EventAction): EventState => {
  switch (action.type) {
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id
            ? { ...event, ...action.payload.event }
            : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    case 'TOGGLE_PARTICIPATION':
      return {
        ...state,
        events: state.events.map(event => {
          if (event.id === action.payload.eventId) {
            const isParticipating = event.participants.includes(action.payload.userId);
            return {
              ...event,
              participants: isParticipating
                ? event.participants.filter(id => id !== action.payload.userId)
                : [...event.participants, action.payload.userId],
              isParticipating: !isParticipating,
            };
          }
          return event;
        }),
      };
    default:
      return state;
  }
};

const initialState: EventState = {
  events: [],
  loading: true,
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refreshEvents();
    }
  }, [user]);

  const refreshEvents = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const events = await StorageService.getEvents();

      const eventsWithParticipation = events.map(event => ({
        ...event,
        isParticipating: user ? event.participants.includes(user.id) : false,
      }));

      dispatch({ type: 'SET_EVENTS', payload: eventsWithParticipation });
    } catch (error) {
      console.error('Error refreshing events:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'participants'>) => {
    try {
      if (!user) return;

      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        participants: [],
        isParticipating: false,
      };

      const updatedEvents = [...state.events, newEvent];
      await StorageService.saveEvents(updatedEvents);
      dispatch({ type: 'ADD_EVENT', payload: newEvent });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (id: string, eventUpdate: Partial<Event>) => {
    try {
      const updatedEvents = state.events.map(event =>
        event.id === id ? { ...event, ...eventUpdate } : event
      );
      await StorageService.saveEvents(updatedEvents);
      dispatch({ type: 'UPDATE_EVENT', payload: { id, event: eventUpdate } });
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const updatedEvents = state.events.filter(event => event.id !== id);
      await StorageService.saveEvents(updatedEvents);
      dispatch({ type: 'DELETE_EVENT', payload: id });
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const toggleParticipation = async (eventId: string) => {
    try {
      if (!user) return;

      const event = state.events.find(e => e.id === eventId);
      if (!event) return;

      const isParticipating = event.participants.includes(user.id);
      const updatedParticipants = isParticipating
        ? event.participants.filter(id => id !== user.id)
        : [...event.participants, user.id];

      const updatedEvent = { ...event, participants: updatedParticipants };
      const updatedEvents = state.events.map(e => e.id === eventId ? updatedEvent : e);

      await StorageService.saveEvents(updatedEvents);
      dispatch({ type: 'TOGGLE_PARTICIPATION', payload: { eventId, userId: user.id } });
    } catch (error) {
      console.error('Error toggling participation:', error);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events: state.events,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleParticipation,
        refreshEvents,
        loading: state.loading,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};