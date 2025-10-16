import React from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/hooks/use-theme';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { Event } from '@/types';
import { AppleHeader } from '@/components/AppleHeader';
import { AppleEventCard } from '@/components/AppleEventCard';
import { Colors, Spacing, Typography } from '@/constants/theme';

export default function EventsScreen() {
  const { events, loading, refreshEvents, deleteEvent, toggleParticipation } = useEvents();
  const { user } = useAuth();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const handleEventPress = (event: Event) => {
    router.push(`/event-details/${event.id}`);
  };

  const handleDeleteEvent = (event: Event) => {
    if (event.createdBy !== user?.id) {
      Alert.alert('Erreur', 'Vous ne pouvez supprimer que vos propres événements');
      return;
    }

    Alert.alert(
      'Supprimer l\'événement',
      'Êtes-vous sûr de vouloir supprimer cet événement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: () => deleteEvent(event.id) },
      ]
    );
  };

  const handleToggleParticipation = (eventId: string) => {
    toggleParticipation(eventId);
  };

  const renderEventItem = ({ item }: { item: Event }) => {
    const isCreatedByUser = item.createdBy === user?.id;

    return (
      <AppleEventCard
        event={item}
        onPress={() => handleEventPress(item)}
        onParticipatePress={() => handleToggleParticipation(item.id)}
        onDeletePress={isCreatedByUser ? () => handleDeleteEvent(item) : undefined}
        isCreatedByUser={isCreatedByUser}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>📅</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Aucun événement
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Commencez par créer votre premier événement
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppleHeader
        title="Événements"
        rightButton={{
          text: "Ajouter",
          onPress: () => router.push('/add-event' as any)
        }}
      />

      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshEvents}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        contentContainerStyle={[
          styles.listContainer,
          events.length === 0 && styles.emptyContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: Spacing.sm,
    paddingBottom: Spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 72,
    marginBottom: Spacing.lg,
  },
  emptyTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
});