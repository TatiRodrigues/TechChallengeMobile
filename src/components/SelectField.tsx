import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type SelectFieldProps<T extends string> = {
  label: string;
  value: T | '';
  placeholder: string;
  options: T[];
  visible: boolean;
  onToggle: () => void;
  onSelect: (value: T) => void;
};

export function SelectField<T extends string>({
  label,
  value,
  placeholder,
  options,
  visible,
  onToggle,
  onSelect,
}: SelectFieldProps<T>) {
  return (
    <View style={styles.selectWrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onToggle}
        style={styles.select}
      >
        <Text style={value ? styles.selectText : styles.selectPlaceholder}>{value || placeholder}</Text>
        <Text style={styles.selectChevron}>{visible ? '▲' : '▼'}</Text>
      </Pressable>
      {visible && (
        <View style={styles.optionsList}>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[styles.option, option === value && styles.optionSelected]}
            >
              <Text style={[styles.optionText, option === value && styles.optionTextSelected]}>{option}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  selectWrapper: { marginBottom: spacing.md },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  select: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: spacing.md,
  },
  selectText: { color: colors.text, fontSize: 14 },
  selectPlaceholder: { color: colors.textSubtle, fontSize: 14 },
  selectChevron: { color: colors.primaryDark, fontSize: 12 },
  optionsList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
    overflow: 'hidden',
  },
  option: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  optionSelected: { backgroundColor: colors.primarySoft },
  optionText: { color: colors.text, fontSize: 14 },
  optionTextSelected: { color: colors.primaryDark, fontWeight: '700' },
});
