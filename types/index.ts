export interface User {
  id: string;
  email: string;
  name: string;
  isLoggedIn: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
  createdBy: string;
  createdAt: string;
  participants: string[];
  isParticipating?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

export interface EventContextType {
  events: Event[];
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'participants'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleParticipation: (eventId: string) => Promise<void>;
  refreshEvents: () => Promise<void>;
  loading: boolean;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  city: string;
}