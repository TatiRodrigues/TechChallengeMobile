import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing } from '../theme/tokens';
import { AppText } from './ui/AppText';

type EmptyStateProps = {
  title?: string;
  message?: string;
  icon?: ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ title, message, icon, loading = false, style }: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      {loading ? (
        <ActivityIndicator color={colors.primary} size="large" />
      ) : (
        <>
          {icon ? <View style={styles.icon}>{icon}</View> : null}
          {title ? (
            <AppText style={styles.title} variant="strong">
              {title}
            </AppText>
          ) : null}
          {message ? (
            <AppText color={colors.textSubtle} variant="caption" style={styles.message}>
              {message}
            </AppText>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 180,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
