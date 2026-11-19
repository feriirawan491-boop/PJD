import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Login } from '@/features/dashboard/login';
describe('Login preview', () => {
  it('shows validation and does not enter with empty credentials', async () => {
    const enter = vi.fn();
    render(<Login onEnter={enter} />);
    fireEvent.click(screen.getByRole('button', { name: 'Masuk ke demo' }));
    expect(
      await screen.findByText('Masukkan alamat email yang valid.'),
    ).toBeInTheDocument();
    expect(enter).not.toHaveBeenCalled();
  });
  it('accepts valid demo input and supports password visibility', async () => {
    const enter = vi.fn();
    render(<Login onEnter={enter} />);
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'demo@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Kata sandi'), {
      target: { value: 'demo12345' },
    });
    fireEvent.click(
      screen.getByRole('button', { name: 'Tampilkan kata sandi' }),
    );
    expect(screen.getByLabelText('Kata sandi')).toHaveAttribute('type', 'text');
    fireEvent.click(screen.getByRole('button', { name: 'Masuk ke demo' }));
    await waitFor(() => expect(enter).toHaveBeenCalledOnce());
  });
});
