import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/use-theme';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import * as Location from 'expo-location';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { DateTimeSelector } from '@/components/DateTimeSelector';
import { Event } from '@/types';

interface EventFormProps {
  initialEvent?: Event;
  initialDate?: Date;
  onSubmit: (eventData: EventFormData) => Promise<void>;
  submitButtonText: string;
  submitButtonLoadingText: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location?: {
    name: string;
    latitude?: number;
    longitude?: number;
  };
}

export function EventForm({
  initialEvent,
  initialDate,
  onSubmit,
  submitButtonText,
  submitButtonLoadingText
}: EventFormProps) {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const [title, setTitle] = useState(initialEvent?.title || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [date, setDate] = useState(() => {
    if (initialEvent) return new Date(initialEvent.date);
    if (initialDate) return initialDate;
    return new Date();
  });
  const [time, setTime] = useState(initialEvent?.time || '');
  const [locationName, setLocationName] = useState(initialEvent?.location?.name || '');
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(
    initialEvent?.location?.latitude && initialEvent?.location?.longitude
      ? { latitude: initialEvent.location.latitude, longitude: initialEvent.location.longitude }
      : null
  );
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const handleGetCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour cette fonctionnalité');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setLocationCoords({ latitude, longitude });

      // Géocodage inverse pour obtenir l'adresse
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses.length > 0) {
        const address = addresses[0];
        const formattedAddress = [
          address.name,
          address.street,
          address.city,
          address.region,
          address.country,
        ].filter(Boolean).join(', ');

        setLocationName(formattedAddress || 'Position actuelle');
      } else {
        setLocationName('Position actuelle');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !time.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);

      const eventData: EventFormData = {
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString().split('T')[0],
        time,
        location: locationName.trim() ? {
          name: locationName.trim(),
          latitude: locationCoords?.latitude,
          longitude: locationCoords?.longitude
        } : undefined,
      };

      await onSubmit(eventData);
    } catch (error) {
      console.error('Error submitting form:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = title.trim() && description.trim() && time.trim();

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            (!isFormValid || loading) && [styles.saveButtonDisabled, { backgroundColor: colors.textMuted }],
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid || loading}
          activeOpacity={0.6}
        >
          <Text style={[
            styles.saveButtonText,
            (!isFormValid || loading) && styles.saveButtonTextDisabled,
          ]}>
            {loading ? submitButtonLoadingText : submitButtonText}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.label, { color: colors.text }]}>Titre <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text
            }]}
            value={title}
            onChangeText={setTitle}
            placeholder="Nom de votre événement"
            placeholderTextColor={colors.textMuted}
            maxLength={100}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.label, { color: colors.text }]}>Description <Text style={styles.required}>*</Text></Text>
          <TextInput
            style={[styles.textArea, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text
            }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre événement..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <Text style={[styles.label, { color: colors.text }]}>Date et heure <Text style={styles.required}>*</Text></Text>
          <DateTimeSelector
            date={date}
            time={time}
            onDateChange={setDate}
            onTimeChange={setTime}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
          <View style={styles.locationHeader}>
            <Text style={[styles.label, { color: colors.text }]}>Lieu</Text>
            <TouchableOpacity
              style={[styles.locationButton, { borderColor: colors.primary }]}
              onPress={handleGetCurrentLocation}
              disabled={loadingLocation}
              activeOpacity={0.6}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={loadingLocation ? colors.textMuted : colors.primary}
              />
              <Text style={[styles.locationButtonText, {
                color: loadingLocation ? colors.textMuted : colors.primary
              }]}>
                {loadingLocation ? 'Localisation...' : 'Ma position'}
              </Text>
            </TouchableOpacity>
          </View>

          <AddressAutocomplete
            initialValue={locationName}
            onLocationSelect={(location) => {
              setLocationName(location.name);
              if (location.latitude && location.longitude) {
                setLocationCoords({
                  latitude: location.latitude,
                  longitude: location.longitude
                });
              }
            }}
            placeholder="Rechercher une adresse..."
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderBottomWidth: 0.33,
    minHeight: 44,
  },
  cancelButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.xs / 2,
    minHeight: 32,
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  saveButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    minWidth: 80,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  saveButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  section: {
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 0.5,
    ...Shadows.subtle,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: Spacing.xs,
    letterSpacing: 0.1,
  },
  required: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    minHeight: 44,
  },
  textArea: {
    borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
    lineHeight: 22,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    gap: 6,
    minHeight: 36,
  },
  locationButtonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});