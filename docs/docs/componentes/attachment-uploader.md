---
title: "AttachmentUploader: anexos"
description: Seleção de imagens e PDFs, prévia, troca e remoção controladas pela tela
---

# AttachmentUploader

Mostra o convite para escolher imagem ou PDF e apresenta o anexo selecionado. Imagens têm prévia; PDFs têm ícone e nome do arquivo. **Não abre a galeria, o seletor de documentos nem faz upload sozinho**: essas ações são callbacks fornecidos pela tela.

[Implementação: AttachmentUploader.tsx](https://github.com/TatiRodrigues/TechChallengeMobile/blob/main/src/components/AttachmentUploader.tsx).

## Propriedades

| Prop | Tipo | Obrigatória | Uso |
|---|---|---|---|
| `label` | `string` | Sim | Rótulo da área |
| `attachment` | `{ uri, name, mimeType }` ou `null` | Sim | Anexo local/URL; `null` mostra estado vazio |
| `onPickImage` | `() => void` | Sim | Selecionar ou trocar imagem |
| `onPickDocument` | `() => void` | Sim | Selecionar ou trocar PDF |
| `onRemove` | `() => void` | Sim | Remover a seleção |

## Exemplo: integrar imagem e PDF

O Expo ImagePicker já é uma dependência do app. O exemplo solicita permissão, mantém a imagem ao cancelar e exibe falhas na tela.

```tsx
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { View } from 'react-native';
import { AttachmentUploader } from '../components/AttachmentUploader';
import { AppText } from '../components/ui/AppText';
import { colors } from '../theme/tokens';

type Attachment = { uri: string; name: string; mimeType: string };

export function AttachmentExample() {
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [error, setError] = useState('');

  async function pickImage() {
    setError('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Autorize o acesso às fotos para selecionar um recibo.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.7,
      });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        setAttachment({
          uri: asset.uri,
          name: asset.fileName ?? 'recibo.jpg',
          mimeType: asset.mimeType ?? 'image/jpeg',
        });
      }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Não foi possível abrir a galeria.');
    }
  }

  async function pickPdf() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
      multiple: false,
    });
    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setAttachment({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? 'application/pdf',
      });
    }
  }

  return (
    <View>
      <AttachmentUploader
        attachment={attachment}
        label="Recibo"
        onPickImage={pickImage}
        onPickDocument={pickPdf}
        onRemove={() => {
          setAttachment(null);
          setError('');
        }}
      />
      {!!error && (
        <AppText color={colors.danger} accessibilityLiveRegion="assertive">
          {error}
        </AppText>
      )}
    </View>
  );
}
```

## Integração com edição

Na edição real, mantenha o anexo existente separado da nova seleção local. Para a interface, passe `receipt ?? existingReceipt`. Ao remover um anexo já salvo, registre `removeReceipt: true` na operação de atualização; limpar apenas o estado não altera o Firestore.

## Cuidados

- O componente oferece JPG, PNG e PDF, mas não valida tamanho de arquivo; valide esse limite antes do upload se o produto exigir.
- Não há suporte a múltiplos anexos, progresso ou prop `loading`.
- O nome e o indicador do arquivo representam uma seleção/URL, não confirmam upload concluído.
- Cancelar o seletor é uma ação normal, não um erro.
- Remover a prévia não apaga um objeto no Storage.

**Veja também:** [Firebase e dados](../firebase-e-dados.md) para distinguir gravação da transação e upload.
