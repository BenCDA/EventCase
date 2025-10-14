import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { GeocodingService, GeocodingResult } from '@/services/geocodingService';

interface AddressAutocompleteProps {
  placeholder?: string;
  onLocationSelect: (location: { name: string; latitude?: number; longitude?: number }) => void;
  initialValue?: string;
  style?: any;
}

export function AddressAutocomplete({
  placeholder = "Rechercher une adresse...",
  onLocationSelect,
  initialValue = "",
  style,
}: AddressAutocompleteProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Debounce la recherche
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await GeocodingService.searchAddresses(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Erreur lors de la recherche d\'adresses:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const handleSelectSuggestion = (suggestion: GeocodingResult) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onLocationSelect({
      name: suggestion.name,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
    });
    Keyboard.dismiss();
  };

  const renderSuggestion = (item: GeocodingResult, index: number) => (
    <TouchableOpacity
      key={`${item.latitude}-${item.longitude}-${index}`}
      style={[
        styles.suggestionItem,
        { borderBottomColor: colors.borderLight },
        index === suggestions.length - 1 && { borderBottomWidth: 0 }
      ]}
      onPress={() => handleSelectSuggestion(item)}
    >
      <Ionicons name="location-outline" size={16} color={colors.primary} />
      <View style={styles.suggestionContent}>
        <Text style={[styles.suggestionName, { color: colors.text }]} numberOfLines={1}>
          {item.city || item.name.split(',')[0]}
        </Text>
        <Text style={[styles.suggestionAddress, { color: colors.textMuted }]} numberOfLines={1}>
          {item.formatted_address || item.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.inputContainer,
        { backgroundColor: colors.surface, borderColor: colors.borderLight }
      ]}>
        <Ionicons name="search-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        {isLoading && (
          <ActivityIndicator size="small" color={colors.primary} />
        )}
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
          >
            <Ionicons name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {showSuggestions && suggestions.length > 0 && (
        <View style={[
          styles.suggestionsContainer,
          { backgroundColor: colors.surface, borderColor: colors.borderLight }
        ]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
          >
            {suggestions.map((item, index) => renderSuggestion(item, index))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    paddingVertical: 0,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginTop: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 0.5,
    gap: Spacing.sm,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: 2,
  },
  suggestionAddress: {
    fontSize: Typography.fontSize.sm,
  },
});