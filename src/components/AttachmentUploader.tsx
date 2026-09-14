import { ExternalLink, FileImage, FileText, Paperclip, RefreshCw, Trash2 } from 'lucide-react-native';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing } from '../theme/tokens';
import type { ReceiptAttachment } from '../types/transaction';

type AttachmentUploaderProps = {
  label: string;
  attachment: ReceiptAttachment | null;
  onPickImage: () => void;
  onPickDocument: () => void;
  onRemove: () => void;
  onView?: () => void;
};

export function AttachmentUploader({ label, attachment, onPickImage, onPickDocument, onRemove, onView }: AttachmentUploaderProps) {
  const isPdf = attachment?.mimeType === 'application/pdf';

  return (
    <View style={styles.attachmentArea}>
      <Text style={styles.label}>{label}</Text>
      {!attachment ? (
        <View style={styles.emptyState}>
          <View style={styles.uploadIcon}>
            <Paperclip color={colors.primary} size={20} />
          </View>
          <View style={styles.emptyCopy}>
            <Text style={styles.uploadText}>Adicionar anexo</Text>
            <Text style={styles.helperText}>Opcional · JPG, PNG ou PDF</Text>
          </View>
          <View style={styles.chooseActions}>
            <Pressable accessibilityLabel="Selecionar imagem do recibo" onPress={onPickImage}>
              <Text style={styles.chooseText}>Imagem</Text>
            </Pressable>
            <Pressable accessibilityLabel="Selecionar documento PDF" onPress={onPickDocument}>
              <Text style={styles.chooseText}>PDF</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.previewCard}>
          <Pressable
            accessibilityLabel={onView ? 'Abrir recibo anexado' : undefined}
            disabled={!onView}
            onPress={onView}
            style={({ pressed }) => [styles.previewSummary, pressed && styles.pressed]}
          >
            {isPdf ? (
              <View accessibilityLabel="Documento PDF anexado" style={styles.documentPreview}>
                <FileText color={colors.primary} size={28} />
              </View>
            ) : (
              <Image accessibilityLabel="Prévia do recibo anexado" source={{ uri: attachment.uri }} style={styles.preview} />
            )}
            <View style={styles.previewDetails}>
              <View style={styles.previewHeading}>
                {isPdf ? <FileText color={colors.primary} size={17} /> : <FileImage color={colors.primary} size={17} />}
                <Text numberOfLines={1} style={styles.previewTitle}>{attachment.name}</Text>
              </View>
              <Text style={styles.previewCaption}>
                Toque para visualizar antes de salvar ou alterar o anexo.
              </Text>
            </View>
            {onView && <ExternalLink color={colors.primaryDark} size={18} />}
          </Pressable>
          <View style={styles.previewActions}>
            <Pressable accessibilityLabel="Trocar por imagem" onPress={onPickImage} style={styles.actionButton}>
              <RefreshCw color={colors.primaryDark} size={14} />
              <Text style={styles.changeAttachment}>Trocar imagem</Text>
            </Pressable>
            <Pressable accessibilityLabel="Trocar por documento PDF" onPress={onPickDocument} style={styles.actionButton}>
              <RefreshCw color={colors.primaryDark} size={14} />
              <Text style={styles.changeAttachment}>Trocar PDF</Text>
            </Pressable>
            <Pressable accessibilityLabel="Remover recibo" onPress={onRemove} style={[styles.actionButton, styles.removeButton]}>
              <Trash2 color={colors.danger} size={14} />
              <Text style={styles.removeAttachment}>Remover</Text>
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
  emptyState: {
    minHeight: 72,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primarySoft,
  },
  uploadIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  emptyCopy: { flex: 1 },
  helperText: { color: colors.textSubtle, fontSize: 12, marginTop: 2 },
  chooseActions: { alignItems: 'flex-end', gap: spacing.xs },
  chooseText: { color: colors.primaryDark, fontSize: 13, fontWeight: '700' },
  uploadText: { color: colors.primaryDark, fontSize: 14, fontWeight: '700' },
  previewCard: { padding: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, backgroundColor: colors.surface },
  previewSummary: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minWidth: 0 },
  preview: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.border },
  documentPreview: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  previewDetails: { flex: 1, minWidth: 0, gap: spacing.xs },
  previewHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  previewTitle: { color: colors.text, fontSize: 14, fontWeight: '700' },
  previewCaption: { color: colors.textMuted, fontSize: 12 },
  previewActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.sm },
  actionButton: {
    minWidth: 112,
    flexGrow: 1,
    flexBasis: '30%',
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.primarySoft,
  },
  removeButton: { backgroundColor: '#FDECEE' },
  changeAttachment: { color: colors.primaryDark, fontSize: 12, fontWeight: '700' },
  removeAttachment: { color: colors.danger, fontSize: 12, fontWeight: '600' },
  pressed: { opacity: 0.72 },
});
