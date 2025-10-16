import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/contexts/AuthContext';
import { EventProvider } from '@/contexts/EventContext';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

export const unstable_settings = {
  anchor: '(auth)',
};

function AppContent() {
  const { colorScheme } = useTheme();

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-event" options={{ presentation: 'modal', title: 'Nouvel Événement' }} />
        <Stack.Screen name="event-details/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="edit-event/[id]" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <AppContent />
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
