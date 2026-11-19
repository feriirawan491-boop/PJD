import {
  ArrowUpRight,
  ArrowRight,
  ReceiptText,
  Clock3,
  CircleCheck,
  Wallet,
  BriefcaseBusiness,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { rupiah } from '@/lib/finance';
import type { FinanceRequest, Section } from '@/types/finance';
export function Overview({
  requests,
  onNavigate,
  onSelect,
}: {
  requests: FinanceRequest[];
  onNavigate: (section: Section) => void;
  onSelect: (request: FinanceRequest) => void;
}) {
  const total = requests.reduce((s, r) => s + r.amount, 0);
  const pending = requests.filter((r) => r.status === 'Menunggu');
  const approved = requests.filter((r) => r.status === 'Disetujui');
  return (
    <>
      <div className="kpi-grid">
        {[
          {
            label: 'Total pengajuan',
            value: String(requests.length).padStart(2, '0'),
            foot: 'Reimburse & perjalanan dinas',
            icon: ReceiptText,
            tone: 'blue',
          },
          {
            label: 'Menunggu tindakan',
            value: String(pending.length).padStart(2, '0'),
            foot: 'Perlu ditinjau sesuai tahap',
            icon: Clock3,
            tone: 'amber',
          },
          {
            label: 'Pengajuan disetujui',
            value: String(approved.length).padStart(2, '0'),
            foot: 'Persetujuan tercatat',
            icon: CircleCheck,
            tone: 'green',
          },
          {
            label: 'Total nominal pengajuan',
            value: rupiah(total),
            foot: 'Berdasarkan tanggal pengajuan',
            icon: Wallet,
            tone: 'purple',
          },
        ].map((k) => (
          <article className="kpi-card" key={k.label}>
            <div className="kpi-top">
              <span>{k.label}</span>
              <span className={`icon-tile ${k.tone}`}>
                <k.icon size={19} />
              </span>
            </div>
            <strong className={k.tone === 'purple' ? 'money' : ''}>
              {k.value}
            </strong>
            <p>
              <span className={`tiny-dot ${k.tone}`} />
              {k.foot}
            </p>
          </article>
        ))}
      </div>
      <div className="analytics-grid">
        <section className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Ringkasan pengeluaran</h2>
              <p>Nominal pengajuan per minggu di bulan November</p>
            </div>
            <span className="subtle-chip">November 2026</span>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-dot blue-dot" />
              Reimburse
            </span>
            <span>
              <i className="legend-dot light-dot" />
              Perjalanan dinas
            </span>
          </div>
          <div
            className="bar-chart"
            role="img"
            aria-label="Grafik nominal pengajuan contoh per minggu. Rincian tersedia pada daftar pengajuan."
          >
            <div className="chart-labels">
              <span>Rp 16 jt</span>
              <span>Rp 12 jt</span>
              <span>Rp 8 jt</span>
              <span>Rp 4 jt</span>
              <span>Rp 0</span>
            </div>
            <div className="chart-plot">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="gridline" />
              ))}
              <div className="bars">
                {[1, 2, 3, 4].map((week) => {
                  const group = requests.filter(
                    (r) => Math.ceil(Number(r.date.slice(-2)) / 7) === week,
                  );
                  const sum = (kind: string) =>
                    group
                      .filter((r) => r.kind === kind)
                      .reduce((s, r) => s + r.amount, 0);
                  return (
                    <div className="bar-group" key={week}>
                      <div className="bar-pair">
                        <div
                          className="bar primary-bar"
                          style={{
                            height: `${(sum('Reimburse') / 16000000) * 100}%`,
                          }}
                          title={rupiah(sum('Reimburse'))}
                        />
                        <div
                          className="bar secondary-bar"
                          style={{
                            height: `${(sum('PJD') / 16000000) * 100}%`,
                          }}
                          title={rupiah(sum('PJD'))}
                        />
                      </div>
                      <span>Minggu {week}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="chart-footer">
            <span>
              <span className="tiny-dot blue" />
              Total pengajuan bulan ini
            </span>
            <strong>{rupiah(total)}</strong>
          </div>
        </section>
        <section className="panel attention-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Antrean Finance</span>
              <h2>Perlu perhatian Anda</h2>
            </div>
            <span className="count-pill">
              {
                pending.filter(
                  (r) =>
                    r.stage === 'Review Finance' ||
                    r.stage === 'Verifikasi laporan F-17',
                ).length
              }
            </span>
          </div>
          <p className="panel-intro">
            Tinjau pengajuan untuk melanjutkan proses.
          </p>
          <div className="attention-list">
            {pending
              .filter(
                (r) =>
                  r.stage === 'Review Finance' ||
                  r.stage === 'Verifikasi laporan F-17',
              )
              .slice(0, 3)
              .map((r) => (
                <button
                  className="attention-item"
                  key={r.id}
                  onClick={() => onSelect(r)}
                >
                  <span
                    className={`icon-tile ${r.kind === 'PJD' ? 'purple' : 'blue'}`}
                  >
                    {r.kind === 'PJD' ? (
                      <BriefcaseBusiness size={19} />
                    ) : (
                      <ReceiptText size={19} />
                    )}
                  </span>
                  <span className="attention-text">
                    <strong>
                      {r.kind === 'PJD'
                        ? 'Verifikasi laporan F-17'
                        : 'Review reimburse'}
                    </strong>
                    <span>
                      {r.name} <span aria-hidden>·</span> {rupiah(r.amount)}
                    </span>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
          </div>
          <div className="attention-note">
            <Clock3 size={17} />
            <span>
              Keputusan Anda membantu proses pengajuan berjalan lebih cepat.
            </span>
          </div>
          <Button
            className="full-width"
            onClick={() => onNavigate('reimburse')}
          >
            Lihat pengajuan <ArrowRight size={15} />
          </Button>
        </section>
      </div>
    </>
  );
}
