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
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEvents } from '@/contexts/EventContext';
import { useAuth } from '@/contexts/AuthContext';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/theme';
import * as Location from 'expo-location';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { DateTimeSelector } from '@/components/DateTimeSelector';

export default function AddEventScreen() {
  const { selectedDate } = useLocalSearchParams<{ selectedDate?: string }>();
  const { addEvent } = useEvents();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => {
    // Si une date est passée en paramètre, l'utiliser, sinon utiliser aujourd'hui
    return selectedDate ? new Date(selectedDate) : new Date();
  });
  const [time, setTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);



  const handleGetCurrentLocation = async () => {
    try {
      setLoadingLocation(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour utiliser votre position actuelle');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      // Reverse geocoding pour obtenir l'adresse
      const [address] = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (address) {
        const fullAddress = [
          address.streetNumber,
          address.street,
          address.city,
          address.postalCode
        ].filter(Boolean).join(' ');

        setLocationName(fullAddress || 'Position actuelle');
        setLocationCoords({ latitude, longitude });

        Alert.alert('Position trouvée', `Adresse ajoutée : ${fullAddress || 'Position actuelle'}`);
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

    if (!user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour créer un événement');
      return;
    }

    try {
      setLoading(true);

      const eventData = {
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString().split('T')[0],
        time,
        location: locationName.trim() ? {
          name: locationName.trim(),
          latitude: locationCoords?.latitude,
          longitude: locationCoords?.longitude
        } : undefined,
        createdBy: user.id,
      };

      await addEvent(eventData);

      Alert.alert('Succès', 'Événement créé avec succès', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création de l\'événement');
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
      <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>Annuler</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Nouvel Événement</Text>

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
            {loading ? 'Création...' : 'Créer'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} contentContainerStyle={styles.formContent}>
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
            style={[styles.input, styles.textArea, {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              color: colors.text
            }]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez votre événement"
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={[styles.charCount, { color: colors.textMuted }]}>
            {description.length}/500 caractères
          </Text>
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
          <Text style={[styles.label, { color: colors.text }]}>Lieu</Text>
          <View style={styles.locationInputContainer}>
            <AddressAutocomplete
              placeholder="Rechercher une adresse..."
              initialValue={locationName}
              onLocationSelect={(location) => {
                setLocationName(location.name);
                if (location.latitude && location.longitude) {
                  setLocationCoords({
                    latitude: location.latitude,
                    longitude: location.longitude
                  });
                } else {
                  setLocationCoords(null);
                }
              }}
              style={styles.autocompleteInput}
            />
            <TouchableOpacity
              style={[styles.locationButton, { backgroundColor: colors.primary }]}
              onPress={handleGetCurrentLocation}
              disabled={loadingLocation}
              activeOpacity={0.6}
            >
              {loadingLocation ? (
                <Ionicons name="refresh-outline" size={20} color="#FFFFFF" />
              ) : (
                <Ionicons name="locate-outline" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>

          {locationCoords && (
            <View style={styles.coordinatesInfo}>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
              <Text style={[styles.coordinatesText, { color: colors.success }]}>
                Coordonnées GPS enregistrées
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.infoSection, { backgroundColor: colors.primary + '10', borderLeftColor: colors.primary }]}>
          <Text style={[styles.infoTitle, { color: colors.primary }]}>Information</Text>
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Une fois créé, votre événement sera visible par tous les utilisateurs de l'application.
            Ils pourront s'inscrire pour y participer.
          </Text>
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
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 0.5,
  },
  cancelButton: {
    paddingVertical: Spacing.sm,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
    minHeight: 36,
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: Typography.fontWeight.semibold,
    fontSize: Typography.fontSize.sm,
  },
  saveButtonTextDisabled: {
    color: '#FFFFFF',
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'right',
    marginTop: Spacing.xs,
  },
  dateButton: {
    borderWidth: 0.5,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  dateButtonText: {
    fontSize: Typography.fontSize.base,
  },
  infoSection: {
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    borderLeftWidth: 4,
    ...Shadows.sm,
  },
  infoTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  locationInputContainer: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  locationInput: {
    flex: 1,
  },
  autocompleteInput: {
    flex: 1,
  },
  locationButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coordinatesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  coordinatesText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
  },
});