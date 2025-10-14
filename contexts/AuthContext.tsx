import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthContextType, User } from '@/types';
import { StorageService } from '@/services/storage';

interface AuthState {
  user: User | null;
  loading: boolean;
}

type AuthAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, loading: false };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  loading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const user = await StorageService.getUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Error checking auth state:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const users = await StorageService.getRegisteredUsers();
      const user = users.find(u => u.email === email);

      if (user) {
        const loggedInUser = { ...user, isLoggedIn: true };
        await StorageService.saveUser(loggedInUser);
        dispatch({ type: 'SET_USER', payload: loggedInUser });
        return true;
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const users = await StorageService.getRegisteredUsers();
      const existingUser = users.find(u => u.email === email);

      if (existingUser) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        isLoggedIn: true,
      };

      const updatedUsers = [...users, newUser];
      await StorageService.saveRegisteredUsers(updatedUsers);
      await StorageService.saveUser(newUser);

      dispatch({ type: 'SET_USER', payload: newUser });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await StorageService.removeUser();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        login,
        register,
        logout,
        loading: state.loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};