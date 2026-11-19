import {
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  FileCheck2,
  ReceiptText,
  SearchCheck,
} from 'lucide-react';

/** Decorative product illustration; labels describe the workflow, not live records. */
export function FinanceIllustration() {
  return (
    <figure
      className="finance-illustration"
      aria-label="Ilustrasi pengajuan biaya yang tersusun rapi, ditinjau Finance, lalu disetujui."
    >
      <div className="illustration-orbit" aria-hidden="true" />
      <div className="illustration-workspace">
        <div className="illustration-window">
          <span />
          <span />
          <span />
          <span className="illustration-window-title">
            Alur kerja yang lebih jelas
          </span>
        </div>
        <div className="illustration-sheet">
          <div className="illustration-sheet-heading">
            <span className="illustration-document">
              <FileCheck2 size={24} />
            </span>
            <div>
              <strong>Setiap pengajuan, tertata.</strong>
              <span>Dari bukti hingga keputusan</span>
            </div>
            <CheckCheck size={22} />
          </div>
          <div className="illustration-request">
            <ReceiptText size={20} />
            <div>
              <strong>Reimburse karyawan</strong>
              <span>Bukti dan rincian dalam satu tempat</span>
            </div>
            <span className="illustration-check">
              <Check size={14} />
            </span>
          </div>
          <div className="illustration-request">
            <BriefcaseBusiness size={20} />
            <div>
              <strong>Perjalanan dinas</strong>
              <span>Anggaran dan realisasi mudah ditinjau</span>
            </div>
            <span className="illustration-check">
              <Check size={14} />
            </span>
          </div>
          <div className="illustration-progress">
            <span />
            <span />
            <span />
          </div>
          <div className="illustration-steps">
            <span>Pengajuan</span>
            <ArrowRight size={14} />
            <span>Peninjauan</span>
            <ArrowRight size={14} />
            <strong>Keputusan</strong>
          </div>
        </div>
      </div>
      <div className="illustration-floating">
        <span>
          <SearchCheck size={21} />
        </span>
        <div>
          <strong>Siap mengambil keputusan</strong>
          <small>Informasi lengkap, proses lebih mudah.</small>
        </div>
      </div>
    </figure>
  );
}
