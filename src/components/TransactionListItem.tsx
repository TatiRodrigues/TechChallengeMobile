import { ArrowDownLeft, ArrowLeftRight, ArrowUpRight, MoreVertical, Paperclip, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
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

// Cada tipo de transação tem um ícone e cor próprios, facilitando reconhecer o
// tipo de movimentação em uma leitura rápida da lista.
const typeIconConfig: Record<Transaction['type'], { Icon: typeof ArrowDownLeft; color: string; background: string }> = {
  deposito: { Icon: ArrowDownLeft, color: colors.primary, background: colors.primarySoft },
  transferencia: { Icon: ArrowLeftRight, color: colors.info, background: '#EAF0FE' },
  saque: { Icon: ArrowUpRight, color: colors.danger, background: '#FDECEE' },
};

export function TransactionListItem({ transaction, showDate = true, onEdit, onDelete }: TransactionListItemProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const isExpense = transaction.type === 'saque';
  const showActions = !!onEdit || !!onDelete;
  const { Icon, color, background } = typeIconConfig[transaction.type];

  function handleEdit() {
    setMenuVisible(false);
    onEdit?.(transaction);
  }

  function handleDelete() {
    setMenuVisible(false);
    onDelete?.(transaction);
  }

  return (
    <View style={styles.row}>
      <View style={[styles.typeIcon, { backgroundColor: background }]}>
        <Icon color={color} size={18} />
      </View>

      <View style={styles.info}>
        <View style={styles.descriptionRow}>
          <AppText numberOfLines={1} style={styles.description} variant="strong">{transaction.description}</AppText>
          {!!transaction.receiptUrl && (
            <View accessibilityLabel="Possui anexo" style={styles.attachmentBadge}>
              <Paperclip color={colors.primaryDark} size={13} />
              <AppText color={colors.primaryDark} variant="caption">Anexo</AppText>
            </View>
          )}
        </View>
        <AppText color={colors.textSubtle} numberOfLines={1} variant="caption">
          {transactionTypeLabels[transaction.type]} · {transaction.category}
          {showDate ? ` · ${formatDate(transaction.createdAt)}` : ''}
        </AppText>
      </View>

      <View style={styles.trailing}>
        <AppText style={[styles.amount, isExpense && styles.amountNegative]} variant="strong">
          {isExpense ? '-' : '+'} {formatCurrency(transaction.amount)}
        </AppText>

        {showActions && (
          <Pressable
            accessibilityLabel="Mais ações"
            hitSlop={8}
            onPress={() => setMenuVisible(true)}
            style={styles.menuButton}
          >
            <MoreVertical color={colors.textSubtle} size={18} />
          </Pressable>
        )}
      </View>

      {showActions && (
        <Modal animationType="fade" onRequestClose={() => setMenuVisible(false)} transparent visible={menuVisible}>
          <Pressable onPress={() => setMenuVisible(false)} style={styles.menuOverlay}>
            <View style={styles.menuCard}>
              <AppText numberOfLines={1} style={styles.menuTitle} variant="strong">
                {transaction.description}
              </AppText>

              {onEdit && (
                <Pressable onPress={handleEdit} style={({ pressed }) => [styles.menuOption, pressed && styles.menuOptionPressed]}>
                  <Pencil color={colors.primary} size={18} />
                  <AppText style={styles.menuOptionText}>Editar</AppText>
                </Pressable>
              )}

              {onDelete && (
                <Pressable onPress={handleDelete} style={({ pressed }) => [styles.menuOption, pressed && styles.menuOptionPressed]}>
                  <Trash2 color={colors.danger} size={18} />
                  <AppText color={colors.danger} style={styles.menuOptionText}>Excluir</AppText>
                </Pressable>
              )}
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 68,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  typeIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  info: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.md,
  },
  descriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  description: {
    flexShrink: 1,
  },
  attachmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flexShrink: 0,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    minWidth: 112,
  },
  amount: {
    color: colors.primary,
    textAlign: 'right',
    maxWidth: 132,
  },
  amountNegative: {
    color: colors.danger,
  },
  menuButton: {
    padding: spacing.xs,
  },
  menuOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(37, 41, 48, 0.4)',
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  menuTitle: {
    marginBottom: spacing.md,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  menuOptionPressed: {
    opacity: 0.7,
  },
  menuOptionText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
