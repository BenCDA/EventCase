import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onParticipatePress: () => void;
  onDeletePress?: () => void;
  isCreatedByUser?: boolean;
}

export function EventCard({
  event,
  onPress,
  onParticipatePress,
  onDeletePress,
  isCreatedByUser
}: EventCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const eventDate = new Date(event.date);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  return (
    <TouchableOpacity
      style={[styles.container, Shadows.md, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        style={styles.dateSection}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.dateText}>{formatDate(eventDate)}</Text>
        <Text style={styles.timeText}>{formatTime(event.time)}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
            {event.title}
          </Text>
          {isCreatedByUser && onDeletePress && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={onDeletePress}
            >
              <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
          {event.description}
        </Text>

        {event.location && (
          <View style={styles.locationContainer}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={[styles.location, { color: colors.success }]} numberOfLines={1}>
              {event.location.name}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.participantsContainer}>
            <View style={styles.participantAvatars}>
              {[...Array(Math.min(3, event.participants.length))].map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.participantAvatar,
                    { backgroundColor: colors.primary, marginLeft: index > 0 ? -8 : 0 }
                  ]}
                >
                  <Text style={styles.participantInitial}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
              ))}
              {event.participants.length > 3 && (
                <View style={[styles.participantAvatar, styles.moreParticipants, { backgroundColor: colors.textMuted }]}>
                  <Text style={styles.moreParticipantsText}>+{event.participants.length - 3}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.participantCount, { color: colors.textMuted }]}>
              {event.participants.length} participant{event.participants.length !== 1 ? 's' : ''}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.participateButton,
              event.isParticipating
                ? { backgroundColor: colors.success }
                : { backgroundColor: colors.borderLight, borderWidth: 1, borderColor: colors.border }
            ]}
            onPress={onParticipatePress}
          >
            <Text
              style={[
                styles.participateText,
                event.isParticipating
                  ? { color: '#FFFFFF' }
                  : { color: colors.primary }
              ]}
            >
              {event.isParticipating ? '✓ Participe' : 'Participer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  dateSection: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  deleteButton: {
    padding: Spacing.xs,
  },
  deleteIcon: {
    fontSize: 16,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  locationIcon: {
    fontSize: Typography.fontSize.sm,
    marginRight: Spacing.xs,
  },
  location: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantsContainer: {
    flex: 1,
  },
  participantAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  participantAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  participantInitial: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: Typography.fontWeight.bold,
  },
  moreParticipants: {
    marginLeft: -8,
  },
  moreParticipantsText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: Typography.fontWeight.bold,
  },
  participantCount: {
    fontSize: Typography.fontSize.xs,
  },
  participateButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
  },
  participateText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
});