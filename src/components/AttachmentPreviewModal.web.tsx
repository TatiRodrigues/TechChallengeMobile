import { X } from 'lucide-react-native';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme/tokens';
import type { ReceiptAttachment } from '../types/transaction';

type AttachmentPreviewModalProps = {
  attachment: ReceiptAttachment | null;
  visible: boolean;
  onClose: () => void;
};

export function AttachmentPreviewModal({ attachment, visible, onClose }: AttachmentPreviewModalProps) {
  const isPdf = attachment?.mimeType === 'application/pdf';

  return (
    <Modal animationType="fade" onRequestClose={onClose} visible={visible}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.headerLabel}>ANEXO</Text>
            <Text numberOfLines={1} style={styles.headerTitle}>{attachment?.name ?? 'Visualizar anexo'}</Text>
          </View>
          <Pressable
            accessibilityLabel="Fechar visualização do anexo"
            onPress={onClose}
            style={styles.closeButton}
          >
            <X color={colors.text} size={24} />
          </Pressable>
        </View>

        <View style={styles.viewer}>
          {!attachment ? (
            <Text style={styles.message}>O anexo não está mais disponível.</Text>
          ) : isPdf ? (
            <iframe
              src={attachment.uri}
              style={{ border: 0, height: '100%', width: '100%' }}
              title={attachment.name}
            />
          ) : (
            <Image
              accessibilityLabel="Visualização ampliada do recibo"
              resizeMode="contain"
              source={{ uri: attachment.uri }}
              style={styles.image}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCopy: { flex: 1, minWidth: 0 },
  headerLabel: { color: colors.primary, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  headerTitle: { color: colors.text, fontSize: 17, fontWeight: '700', marginTop: 2 },
  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  viewer: { flex: 1, alignItems: 'stretch', justifyContent: 'center', backgroundColor: colors.background },
  image: { flex: 1, width: '100%', backgroundColor: colors.text },
  message: { color: colors.textMuted, fontSize: 14, textAlign: 'center', padding: spacing.xl },
});
