import React from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { EventForm, EventFormData } from '@/components/forms/EventForm';

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, updateEvent } = useEvents();
  const { user } = useAuth();

  const event = events.find(e => e.id === id);

  // Vérifier si l'utilisateur peut modifier cet événement
  const canEdit = user && event && event.createdBy === user.id;

  if (!event) {
    Alert.alert('Erreur', 'Événement non trouvé', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  if (!canEdit) {
    Alert.alert('Erreur', 'Vous n\'êtes pas autorisé à modifier cet événement', [
      { text: 'OK', onPress: () => router.back() },
    ]);
    return null;
  }

  const handleSubmit = async (eventData: EventFormData) => {
    if (!id) {
      throw new Error('Event ID is required');
    }

    await updateEvent(id, eventData);

    Alert.alert('Succès', 'Événement modifié avec succès', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <EventForm
      mode="edit"
      initialEvent={event}
      onSubmit={handleSubmit}
      title="Modifier l'Événement"
      submitButtonText="Modifier"
      submitButtonLoadingText="Modification..."
    />
  );
}