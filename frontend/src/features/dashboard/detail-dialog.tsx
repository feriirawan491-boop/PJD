'use client';
import { DemoEvidence } from '@/components/demo-evidence';
import { useState } from 'react';
import { ReceiptText, Check, X, Info } from 'lucide-react';
import { Badge, Button, Modal } from '@/components/ui';
import { canDecide, rupiah, shortDate } from '@/lib/finance';
import type { FinanceRequest, RequestStatus } from '@/types/finance';
export function DetailDialog({
  request,
  onClose,
  onDecision,
  onPayment,
}: {
  request: FinanceRequest | null;
  onClose: () => void;
  onPayment: (id: string, amount: number, note: string) => void;
  onDecision: (id: string, status: RequestStatus, reason: string) => void;
}) {
  const [action, setAction] = useState<'Disetujui' | 'Ditolak' | null>(null);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [payment, setPayment] = useState<'Kasbon' | 'Pelunasan' | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  return (
    <Modal
      open={!!request}
      onOpenChange={(open) => {
        if (!open) {
          setAction(null);
          setReason('');
          setError('');
          onClose();
        }
      }}
      title={
        action
          ? `Konfirmasi ${action === 'Disetujui' ? 'persetujuan' : 'penolakan'}`
          : 'Detail pengajuan'
      }
      description="Data contoh · setiap keputusan hanya berlaku selama sesi demo ini."
    >
      {request && (
        <>
          <div className="detail-summary">
            <span className="icon-tile blue">
              <ReceiptText size={23} />
            </span>
            <div>
              <h3>{request.id}</h3>
              <p>{request.title}</p>
            </div>
            <Badge status={request.status} />
          </div>
          <dl className="detail-grid">
            <div>
              <dt>Pengaju</dt>
              <dd>{request.name}</dd>
            </div>
            <div>
              <dt>Tanggal pengajuan</dt>
              <dd>{shortDate(request.date)}</dd>
            </div>
            <div>
              <dt>Departemen</dt>
              <dd>{request.department}</dd>
            </div>
            <div>
              <dt>Tahap saat ini</dt>
              <dd>{request.stage}</dd>
            </div>
          </dl>
          {request.kind === 'PJD' && (
            <div className="info-banner">
              <Info size={18} />
              <span>
                Status pembayaran:{' '}
                <strong>{request.paid ? 'Lunas' : 'Belum lunas'}</strong>.
                Persetujuan atasan dan Direktur dilakukan melalui WhatsApp.
              </span>
            </div>
          )}
          {request.kind === 'PJD' && (
            <section className="payment-section">
              <h4 className="section-label">Kasbon & pelunasan</h4>
              <div className="payment-summary">
                <span>
                  Tercatat cair{' '}
                  <strong>{rupiah(request.disbursed ?? 0)}</strong>
                </span>
                <span>
                  Sisa nominal demo{' '}
                  <strong>
                    {rupiah(request.amount - (request.disbursed ?? 0))}
                  </strong>
                </span>
              </div>
              <p className="muted">
                Simulasi nominal berdasarkan total contoh. Ketentuan riil
                mengikuti backend existing.
              </p>
              {!request.paid &&
                request.stage !== 'Menunggu atasan · F-16' &&
                request.status !== 'Ditolak' &&
                !action && (
                  <div className="payment-buttons">
                    <Button
                      onClick={() => {
                        setPayment('Kasbon');
                        setAmount('');
                        setError('');
                      }}
                    >
                      Catat kasbon
                    </Button>
                    <Button
                      onClick={() => {
                        setPayment('Pelunasan');
                        setAmount(
                          String(request.amount - (request.disbursed ?? 0)),
                        );
                        setError('');
                      }}
                    >
                      Catat pelunasan
                    </Button>
                  </div>
                )}
              {payment && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const value = Number(amount);
                    if (
                      !Number.isSafeInteger(value) ||
                      value <= 0 ||
                      value > request.amount - (request.disbursed ?? 0)
                    ) {
                      setError(
                        'Nominal harus positif dan tidak melebihi sisa nominal demo.',
                      );
                      return;
                    }
                    if (!note.trim()) {
                      setError('Catatan pembayaran wajib diisi.');
                      return;
                    }
                    onPayment(request.id, value, `${payment}: ${note}`);
                    onClose();
                  }}
                >
                  <h4 className="section-label">
                    Konfirmasi {payment.toLowerCase()} · {request.id}
                  </h4>
                  <label className="form-field">
                    Nominal (Rp)
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={amount}
                      required
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </label>
                  <label className="form-field">
                    Catatan pembayaran
                    <textarea
                      value={note}
                      required
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </label>
                  {error && (
                    <p className="form-error" role="alert">
                      {error}
                    </p>
                  )}
                  <div className="payment-buttons">
                    <Button type="button" onClick={() => setPayment(null)}>
                      Batal
                    </Button>
                    <Button type="submit" variant="primary">
                      Konfirmasi pembayaran demo
                    </Button>
                  </div>
                </form>
              )}
            </section>
          )}
          <h4 className="section-label">
            {request.kind === 'PJD'
              ? 'Rincian pos anggaran / realisasi contoh'
              : 'Rincian biaya'}
          </h4>
          <div className="line-items">
            {request.items.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{rupiah(item.amount)}</strong>
              </div>
            ))}
            <div className="total-row">
              <strong>Total pengajuan</strong>
              <strong>{rupiah(request.amount)}</strong>
            </div>
          </div>
          <DemoEvidence />
          {action && (
            <div className="confirmation">
              <p>
                {action === 'Disetujui'
                  ? `Setujui ${request.id} senilai ${rupiah(request.amount)}?`
                  : `Tolak pengajuan ${request.id}?`}
              </p>
              {action === 'Ditolak' && (
                <label className="form-field">
                  Alasan penolakan{' '}
                  <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'reason-error' : undefined}
                    placeholder="Jelaskan alasan penolakan…"
                  />
                </label>
              )}
              {error && (
                <p id="reason-error" className="form-error" role="alert">
                  {error}
                </p>
              )}
            </div>
          )}
          <div className="dialog-actions">
            <Button
              onClick={() => {
                if (action) {
                  setAction(null);
                  setError('');
                } else onClose();
              }}
            >
              {action ? 'Kembali' : 'Tutup'}
            </Button>
            {!payment &&
              canDecide(request) &&
              (action ? (
                <Button
                  variant={action === 'Ditolak' ? 'danger' : 'primary'}
                  onClick={() => {
                    if (action === 'Ditolak' && !reason.trim()) {
                      setError('Alasan penolakan wajib diisi.');
                      return;
                    }
                    onDecision(request.id, action, reason);
                    setAction(null);
                    setReason('');
                    onClose();
                  }}
                >
                  Konfirmasi simulasi
                </Button>
              ) : (
                <>
                  <Button variant="danger" onClick={() => setAction('Ditolak')}>
                    <X size={16} />
                    Tolak
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => setAction('Disetujui')}
                  >
                    <Check size={16} />
                    {request.kind === 'PJD' ? 'Verifikasi laporan' : 'Setujui'}
                  </Button>
                </>
              ))}
          </div>
        </>
      )}
    </Modal>
  );
}
