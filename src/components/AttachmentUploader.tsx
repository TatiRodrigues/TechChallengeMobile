import { CheckCircle2, Paperclip } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';

type AttachmentUploaderProps = {
  label: string;
  receiptUri: string | null;
  onPick: () => void;
  onRemove: () => void;
};

export function AttachmentUploader({ label, receiptUri, onPick, onRemove }: AttachmentUploaderProps) {
  return (
    <View style={styles.attachmentArea}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.uploadButton} onPress={onPick}>
        {receiptUri ? <CheckCircle2 color={colors.primary} size={20} /> : <Paperclip color={colors.primary} size={20} />}
        <Text style={styles.uploadText}>{receiptUri ? 'Trocar anexo' : 'Selecionar anexo'}</Text>
      </Pressable>
      {receiptUri && (
        <View style={styles.previewRow}>
          <Image accessibilityLabel="Prévia do recibo anexado" source={{ uri: receiptUri }} style={styles.preview} />
          <View style={styles.previewDetails}>
            <Text style={styles.previewTitle}>Anexo selecionado</Text>
            <Text style={styles.previewCaption}>Confira a imagem antes de salvar.</Text>
            <Pressable onPress={onRemove}>
              <Text style={styles.removeAttachment}>Remover anexo</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  attachmentArea: { marginBottom: spacing.lg },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  uploadButton: {
    minHeight: 50,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  uploadText: { color: colors.primaryDark, fontSize: 14, fontWeight: '600' },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.sm, borderRadius: radius.md, backgroundColor: colors.primarySoft },
  preview: { width: 72, height: 72, borderRadius: radius.sm, backgroundColor: colors.border },
  previewDetails: { flex: 1, gap: spacing.xs },
  previewTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  previewCaption: { color: colors.textMuted, fontSize: 12 },
  removeAttachment: { color: colors.danger, fontSize: 12, fontWeight: '600' },
});
