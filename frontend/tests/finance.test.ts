import { describe, expect, it } from 'vitest';
import { initialRequests } from '@/features/dashboard/data';
import { canDecide, decideRequest, filterRequests } from '@/lib/finance';
describe('Finance demo behavior', () => {
  it('filters search, month, kind and status together', () => {
    expect(
      filterRequests(
        initialRequests,
        'Ilham',
        'Menunggu',
        'Reimburse',
        '2026-11',
      ).map((r) => r.id),
    ).toEqual(['RMB-2611-041']);
    expect(
      filterRequests(initialRequests, '', 'Semua status', 'Semua', '2026-10'),
    ).toEqual([]);
  });
  it('requires a meaningful rejection reason', () => {
    expect(() => decideRequest(initialRequests[0], 'Ditolak', '  ')).toThrow(
      'Alasan',
    );
  });
  it('preserves payment status independently from approval', () => {
    const result = decideRequest(initialRequests[1], 'Disetujui', '');
    expect(result.paid).toBe(false);
    expect(result.stage).toBe('Menunggu atasan · F-17');
  });
  it('blocks Director and supervisor steps for Finance', () => {
    expect(canDecide(initialRequests[7])).toBe(false);
    expect(() => decideRequest(initialRequests[7], 'Disetujui', '')).toThrow();
  });
  it('does not allow a second decision or mutate its input', () => {
    const approved = decideRequest(initialRequests[0], 'Disetujui', '');
    expect(initialRequests[0].status).toBe('Menunggu');
    expect(() => decideRequest(approved, 'Ditolak', 'Alasan')).toThrow();
  });
});
