import { Pencil, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';
import { Transaction, transactionTypeLabels } from '../types/transaction';
import { AppText } from './ui/AppText';

type TransactionListItemProps = {
  transaction: Transaction;
  showDate?: boolean;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
};

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function TransactionListItem({ transaction, showDate = true, onEdit, onDelete }: TransactionListItemProps) {
  const isExpense = transaction.type === 'saque';
  const showActions = !!onEdit || !!onDelete;

  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <AppText variant="strong">{transaction.description}</AppText>
        <AppText color={colors.textSubtle} variant="caption">
          {transactionTypeLabels[transaction.type]} · {transaction.category}
          {showDate ? ` · ${formatDate(transaction.createdAt)}` : ''}
        </AppText>
      </View>
      <AppText style={[styles.amount, isExpense && styles.amountNegative]} variant="strong">
        {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
      </AppText>
      {showActions && (
        <View style={styles.actions}>
          {onEdit && (
            <Pressable
              accessibilityLabel="Editar transação"
              hitSlop={8}
              onPress={() => onEdit(transaction)}
              style={styles.actionButton}
            >
              <Pencil color={colors.primary} size={18} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              accessibilityLabel="Excluir transação"
              hitSlop={8}
              onPress={() => onDelete(transaction)}
              style={styles.actionButton}
            >
              <Trash2 color={colors.danger} size={18} />
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  info: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  amount: {
    color: colors.primary,
  },
  amountNegative: {
    color: colors.danger,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginLeft: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
  },
});
