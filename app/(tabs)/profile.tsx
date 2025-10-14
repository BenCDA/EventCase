import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/contexts/AuthContext';
import { useEvents } from '@/contexts/EventContext';
import { AppleHeader } from '@/components/AppleHeader';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';

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
        {/* Carte de profil */}
        <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <Text style={[styles.name, { color: colors.text }]}>{user?.name}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email}</Text>
        </View>

        {/* Statistiques */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{myEvents.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Créés</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.borderLight }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>{participatingEvents.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Participations</Text>
          </View>
        </View>

        {/* Mes événements */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mes Événements</Text>

          {myEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Aucun événement créé
              </Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/add-event' as any)}
                activeOpacity={0.6}
              >
                <Text style={styles.createButtonText}>Créer un événement</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {myEvents.slice(0, 3).map((event, index) => (
                <TouchableOpacity
                  key={event.id}
                  style={[
                    styles.eventItem,
                    { borderColor: colors.borderLight },
                    index === myEvents.slice(0, 3).length - 1 && styles.lastEventItem
                  ]}
                  onPress={() => router.push(`/event-details/${event.id}` as any)}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                  <Text style={[styles.eventDate, { color: colors.primary }]}>
                    {new Date(event.date).toLocaleDateString('fr-FR')} • {event.time}
                  </Text>
                  <Text style={[styles.participantCount, { color: colors.textMuted }]}>
                    {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}

              {myEvents.length > 3 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.showMoreText, { color: colors.primary }]}>
                    Voir tous ({myEvents.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Mes participations */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Mes Participations</Text>

          {participatingEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🎭</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                Aucune participation
              </Text>
            </View>
          ) : (
            <View style={styles.eventsList}>
              {participatingEvents.slice(0, 3).map((event, index) => (
                <TouchableOpacity
                  key={event.id}
                  style={[
                    styles.eventItem,
                    { borderColor: colors.borderLight },
                    index === participatingEvents.slice(0, 3).length - 1 && styles.lastEventItem
                  ]}
                  onPress={() => router.push(`/event-details/${event.id}` as any)}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>
                  <Text style={[styles.eventDate, { color: colors.primary }]}>
                    {new Date(event.date).toLocaleDateString('fr-FR')} • {event.time}
                  </Text>
                  <Text style={[styles.participantCount, { color: colors.textMuted }]}>
                    {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
                  </Text>
                </TouchableOpacity>
              ))}

              {participatingEvents.length > 3 && (
                <TouchableOpacity
                  style={styles.showMoreButton}
                  activeOpacity={0.6}
                >
                  <Text style={[styles.showMoreText, { color: colors.primary }]}>
                    Voir toutes ({participatingEvents.length})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
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
  profileCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: '#FFFFFF',
  },
  name: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  email: {
    fontSize: Typography.fontSize.base,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  statDivider: {
    width: 0.5,
    marginVertical: Spacing.md,
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  section: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  createButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
  },
  eventsList: {
    marginTop: Spacing.xs,
  },
  eventItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
  },
  lastEventItem: {
    borderBottomWidth: 0,
  },
  eventTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  eventDate: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
    fontWeight: Typography.fontWeight.medium,
  },
  participantCount: {
    fontSize: Typography.fontSize.sm,
  },
  showMoreButton: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  showMoreText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});