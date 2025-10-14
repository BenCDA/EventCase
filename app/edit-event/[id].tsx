import React, { useState, useEffect } from 'react';
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

export default function EditEventScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, updateEvent } = useEvents();
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [locationCoords, setLocationCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Charger les données de l'événement
  useEffect(() => {
    const event = events.find(e => e.id === id);
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDate(new Date(event.date));
      setTime(event.time);
      if (event.location) {
        setLocationName(event.location.name);
        if (event.location.latitude && event.location.longitude) {
          setLocationCoords({
            latitude: event.location.latitude,
            longitude: event.location.longitude
          });
        }
      }
    }
  }, [id, events]);

  const event = events.find(e => e.id === id);

  // Vérifier si l'utilisateur peut modifier cet événement
  const canEdit = user && event && event.createdBy === user.id;

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Événement introuvable</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
    );
  }

  if (!canEdit) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 12, backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Accès refusé</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>
            Vous ne pouvez modifier que vos propres événements.
          </Text>
        </View>
      </View>
    );
  }

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

        Alert.alert('Position trouvée', `Adresse mise à jour : ${fullAddress || 'Position actuelle'}`);
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
      };

      await updateEvent(id!, eventData);

      Alert.alert('Succès', 'Événement modifié avec succès', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la modification de l\'événement');
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

        <Text style={[styles.title, { color: colors.text }]}>Modifier l'Événement</Text>

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
            {loading ? 'Modification...' : 'Modifier'}
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
            placeholder="Description détaillée de l'événement"
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

        <View style={[styles.infoSection, { backgroundColor: colors.warning + '10', borderLeftColor: colors.warning }]}>
          <Text style={[styles.infoTitle, { color: colors.warning }]}>Attention</Text>
          <Text style={[styles.infoText, { color: colors.warning }]}>
            Les participants déjà inscrits seront automatiquement notifiés des modifications apportées à l'événement.
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 0.5,
    ...Shadows.sm,
  },
  cancelButton: {
    minWidth: 60,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
    flex: 1,
  },
  saveButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    minWidth: 60,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  saveButtonTextDisabled: {
    opacity: 0.7,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  section: {
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: 0.5,
    ...Shadows.sm,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.fontSize.base,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  charCount: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'right',
    marginTop: Spacing.xs,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
  },
});