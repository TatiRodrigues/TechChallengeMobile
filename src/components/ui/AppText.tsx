import type { ReactNode } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { colors } from '../../theme/tokens';
import { typography } from '../../theme/typography';

type AppTextVariant = 'heading' | 'title' | 'body' | 'label' | 'caption' | 'muted' | 'strong';

type AppTextProps = TextProps & {
  variant?: AppTextVariant;
  children: ReactNode;
  color?: string;
  style?: TextStyle | TextStyle[];
};

export function AppText({ variant = 'body', children, color, style, ...props }: AppTextProps) {
  const variantStyles: Record<AppTextVariant, TextStyle> = {
    heading: styles.heading,
    title: styles.title,
    body: styles.body,
    label: styles.label,
    caption: styles.caption,
    muted: styles.muted,
    strong: styles.strong,
  };

  return (
    <Text {...props} style={[variantStyles[variant], color ? { color } : null, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    color: colors.text,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.relaxed,
  },
  title: {
    color: colors.text,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.normal,
  },
  body: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.normal,
  },
  label: {
    color: colors.text,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.lineHeights.tight,
  },
  caption: {
    color: colors.textSubtle,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    lineHeight: typography.lineHeights.tight,
  },
  muted: {
    color: colors.textMuted,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    lineHeight: typography.lineHeights.normal,
  },
  strong: {
    color: colors.text,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    lineHeight: typography.lineHeights.normal,
  },
});
