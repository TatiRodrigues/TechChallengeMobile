import * as FileSystem from 'expo-file-system/legacy';
import { AlertCircle, FileText, X } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

import { colors, radius, spacing } from '../theme/tokens';
import type { ReceiptAttachment } from '../types/transaction';

type AttachmentPreviewModalProps = {
  attachment: ReceiptAttachment | null;
  visible: boolean;
  onClose: () => void;
};

type PdfPreviewState =
  | { status: 'idle' | 'loading'; html?: undefined; message?: undefined }
  | { status: 'ready'; html: string; message?: undefined }
  | { status: 'error'; html?: undefined; message: string };

function createPdfHtml(base64: string): string {
  const encodedPdf = JSON.stringify(base64);

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3" />
    <style>
      html, body { margin: 0; padding: 0; background: #F4F7F5; font-family: sans-serif; }
      #pages { padding: 12px; }
      .page { margin: 0 auto 12px; box-shadow: 0 2px 10px rgba(37, 41, 48, 0.14); background: white; }
      canvas { display: block; width: 100%; height: auto; }
      #message { padding: 24px; color: #5D6778; text-align: center; }
    </style>
  </head>
  <body>
    <div id="message">Carregando PDF...</div>
    <div id="pages"></div>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <script>
      (async function () {
        try {
          pdfjsLib.GlobalWorkerOptions.workerSrc =
            'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const binary = atob(${encodedPdf});
          const bytes = new Uint8Array(binary.length);
          for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
          }

          const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
          const pages = document.getElementById('pages');
          document.getElementById('message').remove();

          for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
            const page = await pdf.getPage(pageNumber);
            const viewport = page.getViewport({ scale: 1.6 });
            const wrapper = document.createElement('div');
            const canvas = document.createElement('canvas');
            wrapper.className = 'page';
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            wrapper.appendChild(canvas);
            pages.appendChild(wrapper);
            await page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          }

          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
        } catch (error) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: error instanceof Error ? error.message : 'Não foi possível renderizar o PDF.'
          }));
        }
      })();
    </script>
  </body>
</html>`;
}

async function readPdfAsBase64(uri: string): Promise<{ base64: string; temporaryUri?: string }> {
  if (!/^https?:\/\//i.test(uri)) {
    return {
      base64: await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 }),
    };
  }

  if (!FileSystem.cacheDirectory) {
    throw new Error('O diretório temporário do dispositivo não está disponível.');
  }

  const temporaryUri = `${FileSystem.cacheDirectory}receipt-preview-${Date.now()}.pdf`;
  await FileSystem.downloadAsync(uri, temporaryUri);
  return {
    base64: await FileSystem.readAsStringAsync(temporaryUri, { encoding: FileSystem.EncodingType.Base64 }),
    temporaryUri,
  };
}

export function AttachmentPreviewModal({ attachment, visible, onClose }: AttachmentPreviewModalProps) {
  const isPdf = attachment?.mimeType === 'application/pdf';
  const [pdfPreview, setPdfPreview] = useState<PdfPreviewState>({ status: 'idle' });
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState('');

  useEffect(() => {
    if (!visible || !attachment || !isPdf) {
      setPdfPreview({ status: 'idle' });
      return;
    }

    let active = true;
    let temporaryUri: string | undefined;
    setPdfPreview({ status: 'loading' });

    readPdfAsBase64(attachment.uri)
      .then((result) => {
        temporaryUri = result.temporaryUri;
        if (active) {
          setPdfPreview({ status: 'ready', html: createPdfHtml(result.base64) });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setPdfPreview({
            status: 'error',
            message: error instanceof Error ? error.message : 'Não foi possível preparar o PDF.',
          });
        }
      });

    return () => {
      active = false;
      if (temporaryUri) {
        FileSystem.deleteAsync(temporaryUri, { idempotent: true }).catch(() => undefined);
      }
    };
  }, [attachment, isPdf, visible]);

  useEffect(() => {
    if (!visible) {
      setImageError('');
      setImageLoading(false);
    }
  }, [visible]);

  const title = useMemo(() => attachment?.name ?? 'Visualizar anexo', [attachment?.name]);

  function handlePdfMessage(event: WebViewMessageEvent) {
    try {
      const message = JSON.parse(event.nativeEvent.data) as { type?: string; message?: string };
      if (message.type === 'error') {
        setPdfPreview({
          status: 'error',
          message: message.message ?? 'Não foi possível renderizar o PDF.',
        });
      }
    } catch {
      setPdfPreview({ status: 'error', message: 'O visualizador retornou uma resposta inválida.' });
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={onClose} statusBarTranslucent visible={visible}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.headerLabel}>ANEXO</Text>
            <Text numberOfLines={1} style={styles.headerTitle}>{title}</Text>
          </View>
          <Pressable
            accessibilityLabel="Fechar visualização do anexo"
            hitSlop={8}
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}
          >
            <X color={colors.text} size={24} />
          </Pressable>
        </View>

        <View style={styles.viewer}>
          {!attachment ? (
            <PreviewError message="O anexo não está mais disponível." />
          ) : isPdf ? (
            pdfPreview.status === 'ready' ? (
              <WebView
                onMessage={handlePdfMessage}
                originWhitelist={['*']}
                source={{ html: pdfPreview.html }}
                style={styles.webView}
              />
            ) : pdfPreview.status === 'error' ? (
              <PreviewError message={pdfPreview.message} />
            ) : (
              <PreviewLoading label="Preparando PDF..." />
            )
          ) : imageError ? (
            <PreviewError message={imageError} />
          ) : (
            <>
              <Image
                accessibilityLabel="Visualização ampliada do recibo"
                onError={() => {
                  setImageLoading(false);
                  setImageError('Não foi possível carregar esta imagem.');
                }}
                onLoadEnd={() => setImageLoading(false)}
                onLoadStart={() => setImageLoading(true)}
                resizeMode="contain"
                source={{ uri: attachment.uri }}
                style={styles.image}
              />
              {imageLoading && (
                <View style={styles.loadingOverlay}>
                  <PreviewLoading label="Carregando imagem..." />
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function PreviewLoading({ label }: { label: string }) {
  return (
    <View style={styles.centered}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={styles.statusText}>{label}</Text>
    </View>
  );
}

function PreviewError({ message }: { message: string }) {
  return (
    <View style={styles.centered}>
      <View style={styles.errorIcon}>
        <AlertCircle color={colors.danger} size={28} />
      </View>
      <Text style={styles.errorTitle}>Não foi possível visualizar</Text>
      <Text style={styles.statusText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
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
  viewer: { flex: 1, backgroundColor: colors.background },
  webView: { flex: 1, backgroundColor: colors.background },
  image: { flex: 1, width: '100%', backgroundColor: colors.text },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  errorIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDECEE',
  },
  errorTitle: { color: colors.text, fontSize: 18, fontWeight: '700', textAlign: 'center' },
  statusText: { color: colors.textMuted, fontSize: 14, lineHeight: 20, textAlign: 'center' },
  pressed: { opacity: 0.7 },
});
