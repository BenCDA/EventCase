import React from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { EventForm, EventFormData } from '@/components/forms/EventForm';

export default function AddEventScreen() {
  const { selectedDate } = useLocalSearchParams<{ selectedDate?: string }>();
  const { addEvent } = useEvents();
  const { user } = useAuth();

  const handleSubmit = async (eventData: EventFormData) => {
    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un événement');
      throw new Error('User not authenticated');
    }

    const fullEventData = {
      ...eventData,
      createdBy: user.id,
    };

    await addEvent(fullEventData);

    Alert.alert('Succès', 'Événement créé avec succès', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <EventForm
      mode="create"
      initialDate={selectedDate ? new Date(selectedDate) : new Date()}
      onSubmit={handleSubmit}
      title="Nouvel Événement"
      submitButtonText="Créer"
      submitButtonLoadingText="Création..."
    />
  );
}