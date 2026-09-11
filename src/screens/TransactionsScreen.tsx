import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Search, SlidersHorizontal } from 'lucide-react-native';
import { Alert, FlatList, StyleSheet, TextInput, View } from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { FilterChip } from '../components/FilterChip';
import { SectionHeader } from '../components/SectionHeader';
import { TransactionListItem } from '../components/TransactionListItem';
import { ScreenContainer } from '../components/layout/ScreenContainer';
import { AppCard } from '../components/ui/AppCard';
import { AppText } from '../components/ui/AppText';
import { useTransactionFilters } from '../application';
import { useTransactions } from '../contexts/TransactionsContext';
import { deleteTransaction } from '../services/transactions';
import { colors, radius, spacing } from '../theme/tokens';
import { MainTabParamList } from '../types/navigation';
import { Transaction } from '../types/transaction';

export function TransactionsScreen() {
  const { transactions, loading } = useTransactions();
  const { activeFilter, filteredTransactions, search, setActiveFilter, setSearch, transactionFilters } =
    useTransactionFilters(transactions);
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'Transacoes'>>();

  function handleEdit(transaction: Transaction) {
    navigation.navigate('NovaTransacao', { transactionId: transaction.id });
  }

  function handleDelete(transaction: Transaction) {
    Alert.alert(
      'Excluir transação',
      `Tem certeza que deseja excluir "${transaction.description}"? Essa ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTransaction(transaction.id);
            } catch (error) {
              Alert.alert('Erro ao excluir', error instanceof Error ? error.message : 'Tente novamente.');
            }
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer scrollable={false}>
      <AppText variant="heading">Transações</AppText>
      <AppText style={styles.subtitle} variant="muted">
        Consulte e filtre suas movimentações
      </AppText>

      <View style={styles.searchBox}>
        <Search color={colors.textSubtle} size={19} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por descrição"
          placeholderTextColor={colors.textSubtle}
          style={styles.searchInput}
        />
        <SlidersHorizontal color={colors.primary} size={20} />
      </View>

      <FlatList
        horizontal
        data={transactionFilters}
        keyExtractor={(item) => item.value}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
        renderItem={({ item }) => (
          <FilterChip active={activeFilter === item.value} label={item.label} onPress={() => setActiveFilter(item.value)} />
        )}
      />

      <AppCard style={styles.listCard}>
        <SectionHeader
          action={<AppText color={colors.textSubtle} variant="caption">{filteredTransactions.length} transações</AppText>}
          title="Histórico"
        />

        {loading ? (
          <EmptyState loading />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            message="Altere os filtros ou registre uma nova transação."
            title="Nenhuma transação encontrada"
          />
        ) : (
          <FlatList
            data={filteredTransactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listBody}
            renderItem={({ item }) => (
              <TransactionListItem transaction={item} onEdit={handleEdit} onDelete={handleDelete} />
            )}
          />
        )}
      </AppCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  subtitle: { marginTop: spacing.xs, marginBottom: spacing.lg },
  searchBox: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md },
  searchInput: { flex: 1, color: colors.text, fontSize: 14, paddingVertical: 12 },
  filters: { gap: spacing.sm, paddingVertical: spacing.md },
  listCard: { flex: 1, minHeight: 330, padding: 0 },
  listBody: { padding: spacing.md, gap: spacing.sm },
});