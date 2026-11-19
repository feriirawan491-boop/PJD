'use client';
import { useEffect, useState } from 'react';
import {
  Search,
  Eye,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  X,
} from 'lucide-react';
import { Badge, Button, EmptyState } from '@/components/ui';
import { filterRequests, rupiah, shortDate } from '@/lib/finance';
import type { FinanceRequest } from '@/types/finance';
export function RequestTable({
  requests,
  title = 'Pengajuan terbaru',
  kind = 'Semua',
  onSelect,
  onViewAll,
  compact = false,
}: {
  requests: FinanceRequest[];
  title?: string;
  kind?: string;
  onSelect: (r: FinanceRequest) => void;
  onViewAll?: () => void;
  compact?: boolean;
}) {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState('Semua status');
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(false);
  const [month, setMonth] = useState('2026-11');
  const [filters, setFilters] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(timer);
  }, [search]);
  const filtered = filterRequests(
    requests,
    debounced,
    status,
    kind,
    month,
  ).toSorted((a, b) =>
    ascending ? a.amount - b.amount : b.date.localeCompare(a.date),
  );
  const size = compact ? 5 : 6;
  const pages = Math.max(1, Math.ceil(filtered.length / size));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * size, current * size);
  return (
    <section className="panel request-panel">
      <div className="panel-heading">
        <div>
          <h2>
            {title} <span className="inline-count">{filtered.length}</span>
          </h2>
          <p>Pantau status dan tinjau pengajuan tim Anda.</p>
        </div>
        {onViewAll && (
          <button className="text-link" onClick={onViewAll}>
            Lihat semua <ArrowUpRight size={16} />
          </button>
        )}
      </div>
      <div className="table-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari ID, nama, atau pengajuan…"
            aria-label="Cari pengajuan"
          />
          {search && (
            <button aria-label="Hapus pencarian" onClick={() => setSearch('')}>
              <X size={14} />
            </button>
          )}
        </label>
        <div className="filter-controls">
          <select
            aria-label="Filter status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {['Semua status', 'Menunggu', 'Disetujui', 'Ditolak'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <Button onClick={() => setFilters(!filters)} aria-expanded={filters}>
            <SlidersHorizontal size={15} />
            Filter
          </Button>
        </div>
      </div>
      {filters && (
        <div className="extra-filters">
          <label>
            Periode pengajuan{' '}
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </label>
          <Button
            variant="ghost"
            onClick={() => {
              setMonth('2026-11');
              setSearch('');
              setStatus('Semua status');
              setPage(1);
            }}
          >
            Reset filter
          </Button>
        </div>
      )}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>ID / Jenis</th>
              <th>Pengaju</th>
              <th>Tanggal</th>
              <th className="amount-cell">
                <button onClick={() => setAscending(!ascending)}>
                  Nominal <ArrowUpDown size={12} />
                </button>
              </th>
              <th>Status</th>
              <th className="action-cell">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id}>
                <td>
                  <strong className="request-id">{r.id}</strong>
                  <span className="cell-secondary">{r.kind}</span>
                </td>
                <td>
                  <div className="person">
                    <span
                      className={`avatar avatar-${r.initials.charCodeAt(0) % 4}`}
                    >
                      {r.initials}
                    </span>
                    <span>
                      <strong>{r.name}</strong>
                      <span className="cell-secondary">{r.department}</span>
                    </span>
                  </div>
                </td>
                <td className="date-cell">{shortDate(r.date)}</td>
                <td className="amount-cell">
                  <strong>{rupiah(r.amount)}</strong>
                </td>
                <td>
                  <Badge status={r.status} />
                </td>
                <td className="action-cell">
                  <button
                    className="detail-button"
                    onClick={() => onSelect(r)}
                    aria-label={`Lihat detail ${r.id}`}
                  >
                    <Eye size={18} aria-hidden="true" />
                    <span>Detail</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {shown.length === 0 && <EmptyState />}
      <div className="table-footer">
        <span>
          Menampilkan {filtered.length === 0 ? 0 : (current - 1) * size + 1}–
          {Math.min(current * size, filtered.length)} dari {filtered.length}{' '}
          pengajuan
        </span>
        <div className="pagination">
          <button
            disabled={current === 1}
            onClick={() => setPage(current - 1)}
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <span aria-live="polite">
            {current} / {pages}
          </span>
          <button
            disabled={current === pages}
            onClick={() => setPage(current + 1)}
            aria-label="Halaman berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
