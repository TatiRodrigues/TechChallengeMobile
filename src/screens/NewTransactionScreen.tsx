import { useNavigation, useRoute } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AttachmentPreviewModal } from '../components/AttachmentPreviewModal';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { PrimaryButton } from '../components/PrimaryButton';
import { SegmentedControl } from '../components/SegmentedControl';
import { SelectField } from '../components/SelectField';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionsContext';
import { clearTransactionDraft, loadTransactionDraft, saveTransactionDraft } from '../services/drafts';
import { createTransaction, updateTransaction } from '../services/transactions';
import { colors, radius, spacing } from '../theme/tokens';
import { MainTabParamList } from '../types/navigation';
import {
  ReceiptAttachment,
  transactionCategories,
  TransactionType,
  transactionTypeLabels,
} from '../types/transaction';

const transactionTypes: { value: TransactionType; label: string }[] = [
  { value: 'deposito', label: transactionTypeLabels.deposito },
  { value: 'transferencia', label: transactionTypeLabels.transferencia },
  { value: 'saque', label: transactionTypeLabels.saque },
];

const categoryOptions: string[] = [...transactionCategories];
const MAX_RECEIPT_SIZE_BYTES = 2 * 1024 * 1024;

function parseAmount(value: string): number {
  return Number(value.replace(/\D/g, '')) / 100;
}

function formatAmount(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  return (Number(digits) / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDateInput(date: Date): string {
  return date.toLocaleDateString('pt-BR');
}

function parseDateInput(value: string): Date | null {
  const match = value.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;

  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

function validateTransactionDraft(
  selectedType: TransactionType,
  description: string,
  amount: string,
  date: string,
  category: string,
): string | null {
  if (!description.trim()) {
    return 'Informe uma descrição para a transação.';
  }

  const parsedAmount = parseAmount(amount);
  if (!parsedAmount || parsedAmount <= 0) {
    return 'Informe um valor maior que zero.';
  }

  if (!parseDateInput(date)) {
    return 'Informe uma data válida no formato DD/MM/AAAA.';
  }

  if (!category.trim()) {
    return 'Selecione uma categoria para a transação.';
  }

  if (!categoryOptions.includes(category)) {
    return 'Selecione uma categoria válida para a transação.';
  }

  if (selectedType === 'saque' && parsedAmount > 1000000) {
    return 'Valor de saque muito alto para o fluxo atual. Reduza o valor ou confirme a operação.';
  }

  return null;
}

export function NewTransactionScreen() {
  const { user } = useAuth();
  const { transactions } = useTransactions();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList, 'NovaTransacao'>>();
  const route = useRoute();
  const transactionId = (route.params as MainTabParamList['NovaTransacao'])?.transactionId;
  const editingTransaction = useMemo(
    () => (transactionId ? transactions.find((item) => item.id === transactionId) : undefined),
    [transactionId, transactions],
  );
  const isEditing = !!editingTransaction;

  // Clears the transactionId route param when the user navigates to this tab manually
  // (e.g. tapping "Nova transação" in the tab bar) after finishing an edit, so a fresh
  // "new transaction" form is shown instead of getting stuck in edit mode.
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      if (transactionId) {
        navigation.setParams({ transactionId: undefined });
      }
    });
    return unsubscribe;
  }, [navigation, transactionId]);

  const [selectedType, setSelectedType] = useState<TransactionType>('deposito');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(formatDateInput(new Date()));
  const [category, setCategory] = useState('');
  const [categoryOptionsVisible, setCategoryOptionsVisible] = useState(false);
  const [receipt, setReceipt] = useState<ReceiptAttachment | null>(null);
  const [existingReceipt, setExistingReceipt] = useState<ReceiptAttachment | null>(null);
  const [removeExistingReceipt, setRemoveExistingReceipt] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [attachmentPreviewVisible, setAttachmentPreviewVisible] = useState(false);

  // Hydrates the form with the transaction being edited (navigated here from the transaction list).
  useEffect(() => {
    if (!editingTransaction) {
      setExistingReceipt(null);
      setRemoveExistingReceipt(false);
      return;
    }

    setSelectedType(editingTransaction.type);
    setDescription(editingTransaction.description);
    setAmount(formatAmount(String(Math.round(editingTransaction.amount * 100))));
    setDate(formatDateInput(editingTransaction.createdAt));
    setCategory(editingTransaction.category);
    setExistingReceipt(
      editingTransaction.receiptUrl
        ? {
            uri: editingTransaction.receiptUrl,
            name: editingTransaction.receiptName ?? 'Recibo anexado',
            mimeType: editingTransaction.receiptMimeType ?? 'image/jpeg',
          }
        : null,
    );
    setReceipt(null);
    setRemoveExistingReceipt(false);
  }, [editingTransaction]);

  useEffect(() => {
    const userEmail = user?.email;
    if (isEditing || !userEmail) return;
    let active = true;

    async function hydrateDraft(draftUserEmail: string) {
      const savedDraft = await loadTransactionDraft(draftUserEmail);
      if (!active || !savedDraft) return;

      setSelectedType(savedDraft.selectedType);
      setDescription(savedDraft.description);
      setAmount(savedDraft.amount);
      setDate(savedDraft.date || formatDateInput(new Date()));
      setCategory(savedDraft.category);
    }

    hydrateDraft(userEmail);
    return () => {
      active = false;
    };
  }, [isEditing, user]);

  useEffect(() => {
    if (submitting || isEditing || !user) return;

    const draft = {
      selectedType,
      description,
      amount,
      date,
      category,
    };
    saveTransactionDraft(user.email, draft);
    setDraftSaved(true);

    const timeout = setTimeout(() => setDraftSaved(false), 1400);
    return () => clearTimeout(timeout);
  }, [amount, category, date, description, selectedType, submitting, isEditing, user]);

  function handleOpenReceipt() {
    if (receipt ?? existingReceipt) {
      setAttachmentPreviewVisible(true);
    }
  }

  async function handlePickReceipt() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Autorize o acesso às fotos para anexar um recibo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.fileSize && asset.fileSize > MAX_RECEIPT_SIZE_BYTES) {
        Alert.alert('Arquivo muito grande', 'Selecione uma imagem de até 2 MB.');
        return;
      }

      setReceipt({
        uri: asset.uri,
        name: asset.fileName ?? 'recibo.jpg',
        mimeType: asset.mimeType ?? 'image/jpeg',
      });
      setRemoveExistingReceipt(false);
    }
  }

  async function handlePickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      if (asset.size && asset.size > MAX_RECEIPT_SIZE_BYTES) {
        Alert.alert('Arquivo muito grande', 'Selecione um PDF de até 2 MB.');
        return;
      }

      setReceipt({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? 'application/pdf',
      });
      setRemoveExistingReceipt(false);
    }
  }

  function handleRemoveReceipt() {
    setReceipt(null);
    if (existingReceipt) {
      setRemoveExistingReceipt(true);
      setExistingReceipt(null);
    }
  }

  function resetForm() {
    setDescription('');
    setAmount('');
    setDate(formatDateInput(new Date()));
    setCategory('');
    setCategoryOptionsVisible(false);
    setReceipt(null);
    setExistingReceipt(null);
    setRemoveExistingReceipt(false);
  }

  async function handleSubmit() {
    if (!user) return;

    const validationError = validateTransactionDraft(selectedType, description, amount, date, category);
    if (validationError) {
      setError(validationError);
      Alert.alert('Dados incompletos', validationError);
      return;
    }

    setError('');
    setSubmitting(true);

    const parsedAmount = parseAmount(amount);
    const parsedDate = parseDateInput(date);
    if (!parsedDate) return;

    try {
      if (isEditing && editingTransaction) {
        await updateTransaction(editingTransaction.id, {
          type: selectedType,
          description: description.trim(),
          amount: parsedAmount,
          date: parsedDate,
          category: category.trim(),
          receipt,
          removeReceipt: removeExistingReceipt,
        });

        resetForm();
        Alert.alert('Sucesso', 'Transação atualizada com sucesso.', [
          { text: 'OK', onPress: () => navigation.navigate('Transacoes') },
        ]);
        return;
      }

      await createTransaction({
        userId: user.email,
        type: selectedType,
        description: description.trim(),
        amount: parsedAmount,
        date: parsedDate,
        category: category.trim(),
        receipt,
      });

      resetForm();
      await clearTransactionDraft(user.email);
      Alert.alert('Sucesso', 'Transação registrada com sucesso.');
    } catch (error) {
      if (error instanceof Error && error.message === 'RECEIPT_UPLOAD_FAILED') {
        resetForm();
        await clearTransactionDraft(user.email);
        Alert.alert(
          'Transação salva',
          'A transação foi registrada, mas não foi possível anexar o recibo no momento.',
        );
        return;
      }

      if (error instanceof Error && error.message === 'RECEIPT_UPLOAD_FAILED_UPDATE') {
        Alert.alert(
          'Imagem não anexada',
          'Não foi possível anexar o recibo. A transação não foi alterada.',
        );
        return;
      }

      setError(error instanceof Error ? error.message : 'Tente novamente.');
      Alert.alert('Erro ao salvar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>{isEditing ? 'Editar transação' : 'Nova transação'}</Text>
      <Text style={styles.subtitle}>
        {isEditing ? 'Atualize os dados da movimentação selecionada' : 'Registre uma movimentação financeira'}
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.sectionTitle}>Dados da transação</Text>
        <View style={styles.divider} />

        <View style={styles.formBody}>
          <Text style={styles.label}>Tipo</Text>
          <SegmentedControl options={transactionTypes} selectedValue={selectedType} onChange={setSelectedType} />

          <Text style={styles.label}>Descrição</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Ex.: Pagamento de salário"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
          />

          <Text style={styles.label}>Valor</Text>
          <TextInput
            value={amount}
            onChangeText={(value) => setAmount(formatAmount(value))}
            keyboardType="decimal-pad"
            placeholder="R$ 0,00"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
          />

          <Text style={styles.label}>Data da movimentação</Text>
          <TextInput
            accessibilityLabel="Data da movimentação"
            value={date}
            onChangeText={setDate}
            keyboardType="numeric"
            placeholder="DD/MM/AAAA"
            placeholderTextColor={colors.textSubtle}
            style={styles.input}
          />

          <SelectField
            label="Categoria"
            onSelect={(option) => {
              setCategory(option);
              setCategoryOptionsVisible(false);
            }}
            onToggle={() => setCategoryOptionsVisible((visible) => !visible)}
            options={categoryOptions}
            placeholder="Selecione uma categoria"
            value={category}
            visible={categoryOptionsVisible}
          />

          <AttachmentUploader
            attachment={receipt ?? existingReceipt}
            label="Recibo ou documento"
            onPickDocument={handlePickDocument}
            onPickImage={handlePickReceipt}
            onRemove={handleRemoveReceipt}
            onView={handleOpenReceipt}
          />

          {!!error && <Text accessibilityLiveRegion="assertive" style={styles.error}>{error}</Text>}
          {!!draftSaved && <Text style={styles.draftHint}>Rascunho salvo localmente</Text>}

          <PrimaryButton
            loading={submitting}
            onPress={handleSubmit}
            title={isEditing ? 'Salvar alterações' : 'Salvar transação'}
          />
        </View>
      </View>
      <AttachmentPreviewModal
        attachment={receipt ?? existingReceipt}
        onClose={() => setAttachmentPreviewVisible(false)}
        visible={attachmentPreviewVisible}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, padding: spacing.md, paddingBottom: spacing.xl, backgroundColor: colors.background },
  title: { color: colors.text, fontSize: 24, fontWeight: '700' },
  subtitle: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  formCard: { backgroundColor: colors.surface, borderRadius: radius.sm, elevation: 1 },
  sectionTitle: { color: colors.text, fontSize: 18, fontWeight: '600', padding: spacing.md },
  divider: { height: 1, backgroundColor: colors.border },
  formBody: { padding: spacing.md },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: spacing.sm },
  input: { minHeight: 50, color: colors.text, fontSize: 14, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: '#F8F9FA', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  error: { color: colors.danger, backgroundColor: '#FDECEE', borderRadius: 8, padding: spacing.sm, marginBottom: spacing.md },
  draftHint: { color: colors.primary, fontSize: 12, fontWeight: '600', marginBottom: spacing.sm },
});
