'use client';
import { ThemeToggle } from '@/components/theme-toggle';
import { CompanyLogo } from '@/components/company-logo';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  ArrowDownToLine,
  Bell,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X,
  CalendarDays,
  ArrowUpRight,
} from 'lucide-react';
import { company } from '@/constants/company';
import { navigation } from '@/constants/navigation';
import { Button, Modal } from '@/components/ui';
import { initialAudit, initialRequests } from './data';
import { decideRequest, downloadReport } from '@/lib/finance';
import { Overview } from './overview';
import { RequestTable } from './request-table';
import { DetailDialog } from './detail-dialog';
import type { FinanceRequest, RequestStatus, Section } from '@/types/finance';
const SecondaryViews = dynamic(
  () => import('./secondary-views').then((m) => m.SecondaryViews),
  {
    loading: () => (
      <div className="skeleton" role="status">
        Memuat tampilan…
      </div>
    ),
  },
);
const Login = dynamic(() => import('./login').then((m) => m.Login));
const subtitles: Record<Section, string> = {
  overview: 'Pantau pengajuan dan kelola keputusan, dalam satu tempat.',
  reimburse: 'Tinjau bukti dan proses pengajuan reimburse tim Anda.',
  pjd: 'Pantau anggaran, realisasi, dan tahapan perjalanan dinas.',
  reports: 'Ringkasan keuangan yang siap untuk pelaporan.',
  users: 'Kelola data karyawan pengaju reimburse dan perjalanan dinas.',
  audit: 'Setiap proses tercatat, setiap keputusan dapat ditelusuri.',
};
export function Workspace({
  initialSection = 'overview',
  login = false,
}: {
  initialSection?: Section;
  login?: boolean;
}) {
  const [section, setSection] = useState<Section>(initialSection);
  const [requests, setRequests] = useState(initialRequests);
  const [audit, setAudit] = useState(initialAudit);
  const [selected, setSelected] = useState<FinanceRequest | null>(null);
  const [sidebar, setSidebar] = useState(false);
  const [signedOut, setSignedOut] = useState(login);
  const [toast, setToast] = useState('');
  const [help, setHelp] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [exporting, setExporting] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const handler = () => {
      const hash = location.hash.slice(1);
      if (navigation.some((n) => n.id === hash)) setSection(hash as Section);
    };
    handler();
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  function navigate(id: Section) {
    setSection(id);
    setSidebar(false);
    window.history.replaceState(null, '', `#${id}`);
    document.title = `${navigation.find((n) => n.id === id)?.label} | Indotek Finance`;
  }
  function decision(id: string, status: RequestStatus, reason: string) {
    try {
      const found = requests.find((r) => r.id === id);
      if (!found) throw new Error('Pengajuan tidak ditemukan.');
      const updated = decideRequest(found, status, reason);
      setRequests(requests.map((r) => (r.id === id ? updated : r)));
      setAudit([
        {
          id: crypto.randomUUID(),
          requestId: id,
          actor: company.user,
          action: `Simulasi ${status === 'Ditolak' ? 'penolakan' : 'persetujuan'}${reason ? `: ${reason}` : ''}`,
          date: 'Sesi demo saat ini',
          channel: 'Web · demo',
        },
        ...audit,
      ]);
      setToast(`Simulasi berhasil. ${id} ${status.toLowerCase()}.`);
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Keputusan gagal diproses.');
    }
  }
  if (signedOut) return <Login onEnter={() => setSignedOut(false)} />;
  const active = navigation.find((n) => n.id === section)!;
  return (
    <div className="workspace">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>
      {sidebar && (
        <button
          className="sidebar-backdrop"
          aria-label="Tutup navigasi"
          onClick={() => setSidebar(false)}
        />
      )}
      <aside
        className={`sidebar ${sidebar ? 'is-open' : ''}`}
        aria-label="Navigasi utama"
      >
        <a
          className="brand"
          href="#overview"
          onClick={() => navigate('overview')}
        >
          <CompanyLogo />
        </a>
        <nav>
          {navigation.map((item, index) => (
            <div key={item.id}>
              {(index === 0 || item.group !== navigation[index - 1].group) && (
                <p className="nav-label">{item.group}</p>
              )}
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.id);
                }}
                className={`nav-item ${section === item.id ? 'active' : ''}`}
                aria-current={section === item.id ? 'page' : undefined}
              >
                <item.icon size={19} />
                <span>{item.label}</span>
                {item.id === 'reimburse' && (
                  <span className="nav-count">
                    {
                      requests.filter(
                        (r) =>
                          r.kind === 'Reimburse' && r.status === 'Menunggu',
                      ).length
                    }
                  </span>
                )}
              </a>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">
              <CircleHelp size={21} />
            </span>
            <strong>Butuh bantuan?</strong>
            <p>Kenali alur kerja dan panduan penggunaan dashboard.</p>
            <button onClick={() => setHelp(true)}>
              Buka panduan <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="sidebar-status">
            <span className="status-light" />
            Mode demonstrasi<span>v1.0</span>
          </div>
          <button className="profile" onClick={() => setHelp(true)}>
            <span className="avatar profile-avatar">DM</span>
            <span>
              <strong>{company.user}</strong>
              <small>Tim Finance</small>
            </span>
            <ChevronDown size={15} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="mobile-menu"
              aria-label="Buka navigasi"
              aria-expanded={sidebar}
              onClick={() => setSidebar(true)}
            >
              <Menu size={22} />
            </button>
            <span>Workspace</span>
            <ChevronRight size={13} />
            <strong>{active.label}</strong>
          </div>
          <div className="topbar-actions">
            <ThemeToggle />
            <span className="demo-chip">Demo workspace</span>
            <button
              className="icon-button"
              aria-label="Cari pengajuan"
              onClick={() => {
                navigate('reimburse');
                setTimeout(
                  () =>
                    document
                      .querySelector<HTMLInputElement>(
                        'input[aria-label="Cari pengajuan"]',
                      )
                      ?.focus(),
                  0,
                );
              }}
            >
              <Search size={19} />
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Lihat notifikasi"
              onClick={() => setNotifications(true)}
            >
              <Bell size={19} />
              <i />
            </button>
            <span className="topbar-divider" />
            <button
              className="topbar-avatar"
              aria-label="Keluar dari demo"
              onClick={() => setSignedOut(true)}
            >
              DM
            </button>
          </div>
        </header>
        <main id="main-content" className="main-content">
          <div className="page-heading">
            <div>
              <div className="page-eyebrow">
                Ringkasan Finance <span>/</span> {company.period}
              </div>
              <h1>
                {section === 'overview' ? 'Dashboard PJD' : active.label}
                <span className="heading-dot">.</span>
              </h1>
              <p>{subtitles[section]}</p>
            </div>
            <div className="heading-actions">
              <span className="date-chip">
                <CalendarDays size={16} />
                {company.period}
              </span>
              <Button
                disabled={exporting}
                onClick={async () => {
                  setExporting(true);
                  try {
                    await downloadReport(requests, '2026-11');
                    setToast('Rekap demo November berhasil diunduh.');
                  } catch {
                    setToast('Unduhan gagal. Silakan coba lagi.');
                  } finally {
                    setExporting(false);
                  }
                }}
              >
                <ArrowDownToLine size={16} />
                {exporting ? 'Menyiapkan…' : 'Ekspor laporan'}
              </Button>
            </div>
          </div>
          <div className="welcome-line">
            <span>
              <span className="status-light" />
              Selamat bekerja, Dina.{' '}
              <span className="welcome-muted">
                Berikut aktivitas keuangan tim Anda.
              </span>
            </span>
            <span>{company.today}</span>
          </div>
          {section === 'overview' ? (
            <>
              <Overview
                requests={requests}
                onNavigate={navigate}
                onSelect={setSelected}
              />
              <RequestTable
                requests={requests}
                compact
                onSelect={setSelected}
                onViewAll={() => navigate('reimburse')}
              />
            </>
          ) : section === 'reimburse' || section === 'pjd' ? (
            <>
              <div className="info-banner">
                <ShieldCheck size={18} />
                <span>
                  {section === 'pjd'
                    ? 'Aksi Finance mencakup verifikasi F-17. Tahapan atasan dan Direktur tetap melalui WhatsApp.'
                    : 'Pengajuan baru dilakukan melalui WhatsApp. Tinjau detail sebelum membuat keputusan.'}
                </span>
              </div>
              <RequestTable
                key={section}
                requests={requests}
                kind={section === 'pjd' ? 'PJD' : 'Reimburse'}
                title={
                  section === 'pjd'
                    ? 'Pengajuan perjalanan dinas'
                    : 'Daftar reimburse'
                }
                onSelect={setSelected}
              />
            </>
          ) : (
            <SecondaryViews
              section={section}
              requests={requests}
              audit={audit}
              notify={setToast}
            />
          )}
          <footer className="page-footer">
            <span>© 2026 {company.legalName}</span>
            <span>
              <ShieldCheck size={13} />
              Data contoh untuk pratinjau UI{' '}
              <span className="footer-divider">·</span>
              <button onClick={() => setSignedOut(true)}>
                <LogOut size={13} />
                Keluar demo
              </button>
            </span>
          </footer>
        </main>
      </div>
      <DetailDialog
        key={selected?.id ?? 'none'}
        request={selected}
        onClose={() => setSelected(null)}
        onDecision={decision}
        onPayment={(id, amount, note) => {
          const request = requests.find((r) => r.id === id);
          if (!request) return;
          const disbursed = (request.disbursed ?? 0) + amount;
          setRequests(
            requests.map((r) =>
              r.id === id
                ? { ...r, disbursed, paid: disbursed === r.amount }
                : r,
            ),
          );
          setAudit([
            {
              id: crypto.randomUUID(),
              requestId: id,
              actor: company.user,
              action: `Simulasi pembayaran · ${note}`,
              date: 'Sesi demo saat ini',
              channel: 'Web · demo',
            },
            ...audit,
          ]);
          setToast(
            'Pembayaran contoh dicatat. Status persetujuan tetap terpisah.',
          );
        }}
      />
      <Modal
        open={help}
        onOpenChange={setHelp}
        title="Panduan Finance Workspace"
        description="Dashboard demo untuk reimburse dan perjalanan dinas."
      >
        <div className="guide-content">
          <h3>1. Tinjau pengajuan</h3>
          <p>
            Buka Reimburse atau Perjalanan dinas, cari ID atau nama, lalu buka
            detail melalui tombol panah.
          </p>
          <h3>2. Buat keputusan sesuai tahap</h3>
          <p>
            Tinjau rincian, konfirmasi keputusan, dan berikan alasan bila
            menolak. Semua perubahan pada demo bersifat sementara.
          </p>
          <h3>3. Unduh rekap</h3>
          <p>
            Pilih periode di Rekap & laporan. XLSX berisi data contoh yang
            terlihat pada sesi ini.
          </p>
          <div className="info-banner">
            Demo ini belum terhubung ke bot, autentikasi, bukti transaksi, dan
            database produksi.
          </div>
        </div>
      </Modal>
      <Modal
        open={notifications}
        onOpenChange={setNotifications}
        title="Pusat notifikasi"
        description="Pengajuan contoh yang menunggu tindakan."
      >
        <div className="notification-list">
          {requests
            .filter((r) => r.status === 'Menunggu')
            .map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setNotifications(false);
                  setSelected(r);
                }}
              >
                <strong>{r.id}</strong>
                <span>
                  {r.name} · {r.stage}
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
        </div>
      </Modal>
      {toast && (
        <div className="toast" role="status">
          <CircleHelp size={18} />
          <span>{toast}</span>
          <button aria-label="Tutup notifikasi" onClick={() => setToast('')}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
