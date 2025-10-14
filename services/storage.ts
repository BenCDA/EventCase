import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Event } from '@/types';

const KEYS = {
  USER: '@eventease_user',
  EVENTS: '@eventease_events',
  USERS: '@eventease_users',
};

export const StorageService = {
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
      throw error;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEYS.USER);
    } catch (error) {
      console.error('Error removing user:', error);
      throw error;
    }
  },

  async saveEvents(events: Event[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
    } catch (error) {
      console.error('Error saving events:', error);
      throw error;
    }
  },

  async getEvents(): Promise<Event[]> {
    try {
      const eventsData = await AsyncStorage.getItem(KEYS.EVENTS);
      return eventsData ? JSON.parse(eventsData) : [];
    } catch (error) {
      console.error('Error getting events:', error);
      return [];
    }
  },

  async saveRegisteredUsers(users: User[]): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving registered users:', error);
      throw error;
    }
  },

  async getRegisteredUsers(): Promise<User[]> {
    try {
      const usersData = await AsyncStorage.getItem(KEYS.USERS);
      return usersData ? JSON.parse(usersData) : [];
    } catch (error) {
      console.error('Error getting registered users:', error);
      return [];
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.USER, KEYS.EVENTS, KEYS.USERS]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};