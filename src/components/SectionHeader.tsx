import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing } from '../theme/tokens';
import { AppText } from './ui/AppText';

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SectionHeader({ title, subtitle, action, style }: SectionHeaderProps) {
  return (
    <View style={[styles.header, style]}>
      <View style={styles.titleWrap}>
        <AppText variant="title">{title}</AppText>
        {subtitle ? (
          <AppText color={colors.textSubtle} variant="caption">
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleWrap: {
    flex: 1,
    gap: spacing.xs,
  },
  action: {
    flexShrink: 0,
  },
});
