import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

jest.mock('lucide-react-native', () => ({
  FileImage: () => null,
  FileText: () => null,
  ExternalLink: () => null,
  Paperclip: () => null,
  RefreshCw: () => null,
  Trash2: () => null,
}));

import { AttachmentUploader } from '../AttachmentUploader';

jest.setTimeout(15000);

describe('AttachmentUploader', () => {
  it('offers image and PDF selection when no attachment exists', async () => {
    const onPickImage = jest.fn();
    const onPickDocument = jest.fn();

    await render(
      <AttachmentUploader
        attachment={null}
        label="Recibo ou documento"
        onPickDocument={onPickDocument}
        onPickImage={onPickImage}
        onRemove={jest.fn()}
      />,
    );

    await fireEvent.press(screen.getByLabelText('Selecionar imagem do recibo'));
    await fireEvent.press(screen.getByLabelText('Selecionar documento PDF'));

    expect(onPickImage).toHaveBeenCalledTimes(1);
    expect(onPickDocument).toHaveBeenCalledTimes(1);
  });

  it('shows a document indicator instead of an image preview for a PDF', async () => {
    await render(
      <AttachmentUploader
        attachment={{
          uri: 'file:///cache/recibo.pdf',
          name: 'recibo-setembro.pdf',
          mimeType: 'application/pdf',
        }}
        label="Recibo ou documento"
        onPickDocument={jest.fn()}
        onPickImage={jest.fn()}
        onRemove={jest.fn()}
      />,
    );

    expect(screen.getByText('recibo-setembro.pdf')).toBeTruthy();
    expect(screen.getByText('Toque para visualizar antes de salvar ou alterar o anexo.')).toBeTruthy();
  });

  it('offers an action to preview a newly selected or saved attachment', async () => {
    const onView = jest.fn();

    await render(
      <AttachmentUploader
        attachment={{
          uri: 'file:///cache/recibo.jpg',
          name: 'recibo.jpg',
          mimeType: 'image/jpeg',
        }}
        label="Recibo ou documento"
        onPickDocument={jest.fn()}
        onPickImage={jest.fn()}
        onRemove={jest.fn()}
        onView={onView}
      />,
    );

    fireEvent.press(screen.getByLabelText('Abrir recibo anexado'));

    expect(onView).toHaveBeenCalledTimes(1);
  });
});
