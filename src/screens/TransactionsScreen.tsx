import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react-native';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { FilterChip } from '../components/FilterChip';
import { SectionHeader } from '../components/SectionHeader';
import { TransactionListItem } from '../components/TransactionListItem';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import {
  filterTransactions,
  getTransactionDatePeriodBounds,
  useDashboardSummary,
  useTransactionFilters,
} from '../application';
import { useAuth } from '../contexts/AuthContext';
import { usePaginatedTransactions } from '../features/transactions/hooks/usePaginatedTransactions';
import { deleteTransaction } from '../services/transactions';
import { formatCurrency } from '../shared';
import { colors, radius, spacing } from '../theme/tokens';
import { MainTabParamList } from '../types/navigation';
import { Transaction } from '../types/transaction';

export function TransactionsScreen() {
  const { width } = useWindowDimensions();
  const isCompact = width < 560;
  const { user } = useAuth();
  const {
    activeCategory,
    activeDatePeriod,
    activeFilter,
    categories,
    search,
    setActiveCategory,
    setActiveDatePeriod,
    setActiveFilter,
    setSearch,
    transactionDatePeriods,
    transactionFilters,
  } =
    useTransactionFilters([]);
  const queryFilters = useMemo(
    () => ({
      type: activeFilter === 'todas' ? undefined : activeFilter,
      category: activeCategory ?? undefined,
      ...getTransactionDatePeriodBounds(activeDatePeriod),
    }),
    [activeCategory, activeDatePeriod, activeFilter],
  );
  const {
    transactions,
    loading,
    loadingMore,
    error: loadError,
    hasMore,
    loadMore,
    reload,
  } = usePaginatedTransactions(user?.email, queryFilters);
  const filteredTransactions = filterTransactions(transactions, {
    search,
    activeFilter,
    activeCategory,
    activeDatePeriod,
  });
  const { balance, incomeTotal, outcomeTotal } = useDashboardSummary(filteredTransactions);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'Transacoes'>>();
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const hasFocusedOnce = useRef(false);

  useFocusEffect(
    useCallback(() => {
      if (hasFocusedOnce.current) reload();
      hasFocusedOnce.current = true;
    }, [reload]),
  );

  // Usado para destacar visualmente o botão de filtros quando algum filtro
  // (além do texto de busca) está ativo, dando um retorno claro ao usuário.
  const activeFilterCount = [
    activeFilter !== 'todas',
    activeCategory !== null,
    activeDatePeriod !== 'all',
  ].filter(Boolean).length;

  function handleNewTransaction() {
    navigation.navigate('NovaTransacao', undefined);
  }

  function handleEdit(transaction: Transaction) {
    navigation.navigate('NovaTransacao', { transactionId: transaction.id });
  }

  function handleDelete(transaction: Transaction) {
    setDeleteError('');
    setTransactionToDelete(transaction);
  }

  function closeDeleteModal() {
    if (!deleting) {
      setTransactionToDelete(null);
      setDeleteError('');
    }
  }

  async function confirmDelete() {
    if (!transactionToDelete) return;

    setDeleting(true);
    setDeleteError('');
    try {
      await deleteTransaction(transactionToDelete.id);
      setTransactionToDelete(null);
      reload();
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Não foi possível excluir a transação. Tente novamente.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <ScreenContainer contentStyle={styles.screenContent}>
      <View style={styles.pageHeader}>
        <View style={styles.headingCopy}>
          <AppText color={colors.primary} variant="label">MOVIMENTAÇÕES</AppText>
          <AppText variant="heading">Histórico</AppText>
          <AppText style={styles.subtitle} variant="muted">
            Consulte, pesquise e organize tudo o que entrou e saiu.
          </AppText>
        </View>
        <Pressable
          accessibilityLabel="Adicionar movimentação"
          onPress={handleNewTransaction}
          style={({ pressed }) => [styles.addButton, isCompact && styles.addButtonCompact, pressed && styles.pressed]}
        >
          <Plus color={colors.surface} size={18} />
          {!isCompact && <Text style={styles.addButtonText}>Adicionar movimentação</Text>}
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Search color={colors.textSubtle} size={19} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por descrição"
          placeholderTextColor={colors.textSubtle}
          style={styles.searchInput}
        />
        <Pressable
          accessibilityLabel="Abrir filtros"
          hitSlop={8}
          onPress={() => setFiltersVisible(true)}
          style={({ pressed }) => [styles.filterButton, pressed && styles.pressed]}
        >
          <SlidersHorizontal color={colors.primary} size={20} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      <View style={styles.filterSummary}>
        <AppText color={colors.textMuted} variant="caption">
          {transactionDatePeriods.find((period) => period.value === activeDatePeriod)?.label ?? 'Todo período'} ·{' '}
          {transactionFilters.find((filter) => filter.value === activeFilter)?.label ?? 'Todas'}
          {activeCategory ? ` · ${activeCategory}` : ''}
        </AppText>
        {activeFilterCount > 0 && (
          <Pressable
            accessibilityLabel="Limpar filtros ativos"
            onPress={() => {
              setActiveFilter('todas');
              setActiveCategory(null);
              setActiveDatePeriod('all');
            }}
          >
            <AppText color={colors.primary} variant="caption">Limpar filtros</AppText>
          </Pressable>
        )}
      </View>

      <View style={[styles.totals, isCompact && styles.totalsCompact]}>
        <View style={[styles.totalItem, isCompact && styles.totalItemCompact]}>
          <AppText color={colors.textSubtle} variant="caption">Entradas</AppText>
          <AppText color={colors.primary} variant="strong">{formatCurrency(incomeTotal)}</AppText>
        </View>
        <View style={[styles.totalDivider, isCompact && styles.totalDividerCompact]} />
        <View style={[styles.totalItem, isCompact && styles.totalItemCompact]}>
          <AppText color={colors.textSubtle} variant="caption">Saídas</AppText>
          <AppText color={colors.danger} variant="strong">{formatCurrency(outcomeTotal)}</AppText>
        </View>
        <View style={[styles.totalDivider, isCompact && styles.totalDividerCompact]} />
        <View style={[styles.totalItem, styles.resultTotalItem, isCompact && styles.totalItemCompact]}>
          <AppText color={colors.textSubtle} variant="caption">Saldo</AppText>
          <AppText color={balance < 0 ? colors.danger : colors.text} variant="strong">{formatCurrency(balance)}</AppText>
        </View>
      </View>

      <AppCard style={styles.listCard}>
        <SectionHeader title="Movimentações encontradas" />

        {!!loadError && <Text accessibilityLiveRegion="assertive" style={styles.loadError}>{loadError}</Text>}

        {loading ? (
          <EmptyState loading />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            message="Altere os filtros ou registre uma nova transação."
            title="Nenhuma transação encontrada"
          />
        ) : (
          <View style={styles.listBody}>
            <View style={styles.listLegend}>
              <AppText color={colors.textSubtle} variant="caption">MOVIMENTAÇÃO</AppText>
              <AppText color={colors.textSubtle} variant="caption">VALOR</AppText>
            </View>
            {filteredTransactions.map((item) => (
              <TransactionListItem key={item.id} transaction={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
            {hasMore && (
              <Pressable
                accessibilityLabel="Carregar mais transações"
                disabled={loadingMore}
                onPress={() => void loadMore()}
                style={({ pressed }) => [styles.loadMoreButton, pressed && !loadingMore && styles.pressed, loadingMore && styles.disabled]}
              >
                {loadingMore ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={styles.loadMoreButtonText}>Carregar mais transações</Text>
                )}
              </Pressable>
            )}
          </View>
        )}
      </AppCard>

      <Modal
        animationType="fade"
        onRequestClose={closeDeleteModal}
        transparent
        visible={transactionToDelete !== null}
      >
        <View style={styles.modalOverlay}>
          <View accessibilityViewIsModal style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Excluir transação?</Text>
              <Pressable
                accessibilityLabel="Fechar confirmação de exclusão"
                disabled={deleting}
                hitSlop={8}
                onPress={closeDeleteModal}
                style={({ pressed }) => [styles.closeButton, pressed && !deleting && styles.pressed]}
              >
                <X color={colors.textMuted} size={22} />
              </Pressable>
            </View>
            <Text style={styles.modalMessage}>
              Tem certeza que deseja excluir "{transactionToDelete?.description}"? Essa ação não pode ser desfeita.
            </Text>
            {!!deleteError && <Text style={styles.modalError}>{deleteError}</Text>}
            <View style={styles.modalActions}>
              <Pressable
                accessibilityLabel="Cancelar exclusão"
                disabled={deleting}
                onPress={closeDeleteModal}
                style={({ pressed }) => [styles.cancelButton, pressed && !deleting && styles.pressed]}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Confirmar exclusão"
                disabled={deleting}
                onPress={confirmDelete}
                style={({ pressed }) => [styles.deleteButton, pressed && !deleting && styles.pressed, deleting && styles.disabled]}
              >
                {deleting ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.deleteButtonText}>Excluir</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setFiltersVisible(false)}
        transparent
        visible={filtersVisible}
      >
        <View style={styles.modalOverlay}>
          <View accessibilityViewIsModal style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrar transações</Text>
              <Pressable
                accessibilityLabel="Fechar filtros"
                hitSlop={8}
                onPress={() => setFiltersVisible(false)}
                style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
              >
                <X color={colors.textMuted} size={22} />
              </Pressable>
            </View>
            <Text style={styles.filterLabel}>Período</Text>
            <View style={styles.filterOptions}>
              {transactionDatePeriods.map((period) => (
                <FilterChip
                  active={activeDatePeriod === period.value}
                  key={period.value}
                  label={period.label}
                  onPress={() => setActiveDatePeriod(period.value)}
                />
              ))}
            </View>
            <Text style={styles.filterLabel}>Tipo</Text>
            <View style={styles.filterOptions}>
              {transactionFilters.map((filter) => (
                <FilterChip
                  active={activeFilter === filter.value}
                  key={filter.value}
                  label={filter.label}
                  onPress={() => setActiveFilter(filter.value)}
                />
              ))}
            </View>
            <Text style={styles.filterLabel}>Categoria</Text>
            <View style={styles.filterOptions}>
              <FilterChip active={activeCategory === null} label="Todas" onPress={() => setActiveCategory(null)} />
              {categories.map((category) => (
                <FilterChip
                  active={activeCategory === category}
                  key={category}
                  label={category}
                  onPress={() => setActiveCategory(category)}
                />
              ))}
            </View>
            <View style={styles.modalActions}>
              <Pressable
                accessibilityLabel="Limpar filtros"
                onPress={() => {
                  setActiveFilter('todas');
                  setActiveCategory(null);
                  setActiveDatePeriod('all');
                  setSearch('');
                }}
                style={({ pressed }) => [styles.cancelButton, pressed && styles.pressed]}
              >
                <Text style={styles.cancelButtonText}>Limpar</Text>
              </Pressable>
              <Pressable
                accessibilityLabel="Aplicar filtros"
                onPress={() => setFiltersVisible(false)}
                style={({ pressed }) => [styles.applyButton, pressed && styles.pressed]}
              >
                <Text style={styles.applyButtonText}>Aplicar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screenContent: { paddingBottom: spacing.xl },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  headingCopy: { flex: 1, minWidth: 0 },
  subtitle: { marginTop: spacing.xs },
  addButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    shadowColor: colors.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  addButtonText: { color: colors.surface, fontSize: 13, fontWeight: '700' },
  addButtonCompact: { width: 44, paddingHorizontal: 0, borderRadius: 22 },
  searchBox: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 12 },
  filterButton: { padding: spacing.xs },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  filterBadgeText: { color: colors.surface, fontSize: 10, fontWeight: '700' },
  loadError: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: radius.md, padding: spacing.sm, marginTop: spacing.md },
  loadMoreButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  loadMoreButtonText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  filters: { gap: spacing.sm, paddingVertical: spacing.md },
  totals: {
    alignItems: 'stretch',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  totalsCompact: { flexDirection: 'column', paddingVertical: 0 },
  totalItem: { alignItems: 'center', flex: 1, gap: spacing.xs, paddingHorizontal: spacing.xs },
  totalDivider: { backgroundColor: colors.border, width: 1 },
  totalDividerCompact: { width: '100%', height: 1 },
  resultTotalItem: { backgroundColor: colors.primarySoft, borderRadius: radius.sm, marginVertical: spacing.xs, paddingVertical: spacing.sm },
  totalItemCompact: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 46, paddingHorizontal: spacing.md },
  listCard: { padding: spacing.md, overflow: 'hidden' },
  listBody: { paddingTop: spacing.sm, gap: spacing.xs },
  listLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xs,
  },
  filterSummary: {
  minHeight: 28,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: -spacing.sm,
  marginBottom: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 41, 48, 0.52)',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700' },
  closeButton: { alignItems: 'center', justifyContent: 'center', minHeight: 32, minWidth: 32 },
  modalMessage: { color: colors.textMuted, fontSize: 15, lineHeight: 22 },
  modalError: { color: colors.danger, fontSize: 13, marginTop: spacing.md },
  filterLabel: { color: colors.text, fontSize: 14, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.sm },
  filterOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.lg },
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  cancelButtonText: { color: colors.text, fontSize: 14, fontWeight: '700' },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 86,
    paddingHorizontal: spacing.md,
  },
  deleteButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  applyButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: spacing.md,
  },
  applyButtonText: { color: colors.surface, fontSize: 14, fontWeight: '700' },
  disabled: { opacity: 0.7 },
  pressed: { opacity: 0.88 },
});