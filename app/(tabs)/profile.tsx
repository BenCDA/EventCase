import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { AppleHeader } from '@/components/AppleHeader';
import { ProfileCard, StatsCard, EventsSection } from '@/components/profile';
import { Colors, Spacing } from '@/constants/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { events } = useEvents();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: logout },
      ]
    );
  };

  const myEvents = events.filter(event => event.createdBy === user?.id);
  const participatingEvents = events.filter(event => event.isParticipating);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppleHeader
        title="Profil"
        rightButton={{
          text: "Se déconnecter",
          onPress: handleLogout
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ProfileCard name={user?.name} email={user?.email} />
        <StatsCard
          createdCount={myEvents.length}
          participatingCount={participatingEvents.length}
        />
        <EventsSection
          title="Mes Événements"
          events={myEvents}
          emptyIcon="📝"
          emptyText="Aucun événement créé"
          showCreateButton
        />
        <EventsSection
          title="Mes Participations"
          events={participatingEvents}
          emptyIcon="🎭"
          emptyText="Aucune participation"
        />
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: Spacing.xl,
  },
});