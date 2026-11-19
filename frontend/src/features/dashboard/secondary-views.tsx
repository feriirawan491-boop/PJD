'use client';
import { useState } from 'react';
import { initialEmployees } from './employees';
import { Download, FileSpreadsheet, UsersRound } from 'lucide-react';
import { Button, EmptyState, Modal } from '@/components/ui';
import { downloadReport, rupiah } from '@/lib/finance';
import type { AuditEntry, FinanceRequest, Section } from '@/types/finance';
export function SecondaryViews({
  section,
  requests,
  audit,
  notify,
}: {
  section: Section;
  requests: FinanceRequest[];
  audit: AuditEntry[];
  notify: (message: string) => void;
}) {
  const [month, setMonth] = useState('2026-11');
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [registerOpen, setRegisterOpen] = useState(false);
  const [userError, setUserError] = useState('');
  const [users, setUsers] = useState(initialEmployees);
  if (section === 'reports') {
    const rows = requests.filter((r) => r.date.startsWith(month));
    return (
      <section className="panel report-panel">
        <div className="report-icon">
          <FileSpreadsheet size={30} />
        </div>
        <span className="eyebrow">Laporan bulanan</span>
        <h2>Semua angka, dalam satu rekap.</h2>
        <p>Pilih periode untuk melihat ringkasan dan mengunduh data contoh.</p>
        <label className="form-field">
          Periode laporan
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
        <div className="report-stats">
          <div>
            <span>Total pengajuan</span>
            <strong>{rows.length}</strong>
          </div>
          <div>
            <span>Nominal pengajuan</span>
            <strong>
              {rupiah(rows.reduce((sum, r) => sum + r.amount, 0))}
            </strong>
          </div>
          <div>
            <span>Disetujui</span>
            <strong>
              {rows.filter((r) => r.status === 'Disetujui').length}
            </strong>
          </div>
        </div>
        <Button
          variant="primary"
          disabled={busy || !rows.length}
          onClick={async () => {
            setBusy(true);
            try {
              await downloadReport(requests, month);
              notify('Rekap data contoh berhasil diunduh.');
            } catch {
              notify('Unduhan gagal. Silakan coba lagi.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <Download size={17} />
          {busy ? 'Menyiapkan file…' : 'Unduh rekap XLSX'}
        </Button>
        <small className="report-caption">
          Data simulasi frontend · belum terhubung ke recap.py.
        </small>
      </section>
    );
  }
  if (section === 'users')
    return (
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>
              Data karyawan <span className="inline-count">{users.length}</span>
            </h2>
            <p>
              Data karyawan untuk pengajuan reimburse dan perjalanan dinas
              melalui WhatsApp.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setUserError('');
              setRegisterOpen(true);
            }}
          >
            <UsersRound size={16} />
            Tambah karyawan
          </Button>
        </div>
        <div className="directory">
          {users.map((u) => (
            <article key={u.name}>
              <span className="avatar avatar-1">
                {u.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <h3>{u.name}</h3>
              <p>{u.department}</p>
              <p className="user-whatsapp">
                WA: {u.whatsapp || 'Belum ditambahkan'}
              </p>
              <span className="subtle-chip">Karyawan pengaju</span>
            </article>
          ))}
        </div>
        <Modal
          open={registerOpen}
          onOpenChange={setRegisterOpen}
          title="Tambah karyawan"
          description="Daftarkan data karyawan pengaju. Data demo disimpan sementara selama sesi ini."
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const name = String(data.get('name')).trim();
              if (!name) return;
              const input = String(data.get('whatsapp') ?? '').replace(
                /[\s()-]/g,
                '',
              );
              const whatsapp = input.startsWith('08')
                ? '+62' + input.slice(1)
                : input.startsWith('62')
                  ? '+' + input
                  : input;
              if (!/^\+628[1-9]\d{6,10}$/.test(whatsapp)) {
                setUserError(
                  'Masukkan nomor WhatsApp Indonesia yang valid, misalnya 081234567890.',
                );
                return;
              }
              if (users.some((user) => user.whatsapp === whatsapp)) {
                setUserError(
                  'Nomor WhatsApp sudah terdaftar untuk karyawan lain.',
                );
                return;
              }
              setUserError('');
              setUsers([
                ...users,
                {
                  name,
                  department: String(data.get('department')),
                  whatsapp,
                },
              ]);
              setRegisterOpen(false);
              notify('Data karyawan contoh berhasil ditambahkan.');
            }}
          >
            <label className="form-field">
              Nama lengkap
              <input name="name" required maxLength={80} />
            </label>
            <label className="form-field">
              Nomor WhatsApp
              <input
                name="whatsapp"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="081234567890"
                required
                maxLength={20}
                aria-invalid={!!userError}
                aria-describedby="whatsapp-hint whatsapp-error"
                onChange={() => setUserError('')}
              />
              <small id="whatsapp-hint" className="muted">
                Gunakan nomor aktif. Format 08, 628, atau +628.
              </small>
            </label>
            {userError && (
              <p id="whatsapp-error" className="form-error" role="alert">
                {userError}
              </p>
            )}
            <label className="form-field">
              Departemen
              <select name="department">
                <option>Engineering</option>
                <option>Operations</option>
                <option>Human Resources</option>
                <option>Business Development</option>
              </select>
            </label>
            <p className="muted">
              Nomor WhatsApp digunakan sebagai identitas karyawan saat
              mengajukan reimburse atau perjalanan dinas.
            </p>
            <div className="dialog-actions">
              <Button type="button" onClick={() => setRegisterOpen(false)}>
                Batal
              </Button>
              <Button variant="primary" type="submit">
                Simpan karyawan
              </Button>
            </div>
          </form>
        </Modal>
      </section>
    );
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Jejak aktivitas</h2>
          <p>Riwayat pengajuan dan simulasi keputusan Finance.</p>
        </div>
        <input
          className="standalone-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ID atau aktivitas…"
          aria-label="Cari aktivitas"
        />
      </div>
      <div className="audit-list">
        {audit
          .filter((a) =>
            `${a.requestId} ${a.action} ${a.actor}`
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .map((a) => (
            <article key={a.id}>
              <span className="audit-point" />
              <div>
                <strong>{a.action}</strong>
                <p>
                  {a.actor} <span>·</span> {a.requestId}
                </p>
                <small>{a.date}</small>
              </div>
              <span className="subtle-chip">{a.channel}</span>
            </article>
          ))}
        {!audit.some((a) =>
          `${a.requestId} ${a.action} ${a.actor}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        ) && <EmptyState title="Aktivitas tidak ditemukan" />}
      </div>
    </section>
  );
}
