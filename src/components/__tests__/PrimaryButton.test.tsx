import { fireEvent, render, screen } from '@testing-library/react-native';
import { describe, expect, it, jest } from '@jest/globals';

import { PrimaryButton } from '../PrimaryButton';

describe('PrimaryButton', () => {
  it('invokes the callback when the user presses an enabled button', async () => {
    const onPress = jest.fn();

    await render(<PrimaryButton title="Salvar transação" onPress={onPress} />);

    fireEvent.press(screen.getByRole('button', { name: 'Salvar transação' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['loading', { loading: true }],
    ['disabled', { disabled: true }],
  ])('does not invoke the callback when %s', async (_state, props) => {
    const onPress = jest.fn();

    await render(<PrimaryButton title="Salvar transação" onPress={onPress} {...props} />);

    const button = screen.getByRole('button', { name: 'Salvar transação' });
    expect(button).toBeDisabled();
    fireEvent.press(button);

    expect(onPress).not.toHaveBeenCalled();
  });
});
