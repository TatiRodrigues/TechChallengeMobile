import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, spacing } from '../../theme/tokens';

type ScreenContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
};

export function ScreenContainer({ children, scrollable = true, contentStyle, style }: ScreenContainerProps) {
  if (scrollable) {
    return (
      <ScrollView contentContainerStyle={[styles.content, contentStyle]} style={[styles.scroll, style]}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[styles.static, styles.content, contentStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  static: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 1180,
    alignSelf: 'center',
    padding: spacing.md,
    paddingBottom: 104,
  },
});
