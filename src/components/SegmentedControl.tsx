import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentedControlOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.segmentedControl}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.segment, selectedValue === option.value && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, selectedValue === option.value && styles.segmentTextActive]}>
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  segment: {
    flex: 1,
    minHeight: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  segmentActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  segmentText: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
  },
  segmentTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
