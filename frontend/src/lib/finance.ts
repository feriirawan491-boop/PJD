import type { FinanceRequest, RequestStatus } from '@/types/finance';
export const rupiah = (value: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
export const shortDate = (value: string) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  }).format(new Date(value + 'T00:00:00+07:00'));
export function filterRequests(
  requests: FinanceRequest[],
  search: string,
  status: string,
  kind: string,
  month = '2026-11',
) {
  const term = search.toLocaleLowerCase('id');
  return requests.filter(
    (r) =>
      (!month || r.date.startsWith(month)) &&
      (status === 'Semua status' || r.status === status) &&
      (kind === 'Semua' || r.kind === kind) &&
      `${r.id} ${r.name} ${r.title}`.toLocaleLowerCase('id').includes(term),
  );
}
export function canDecide(request: FinanceRequest) {
  return (
    request.status === 'Menunggu' &&
    (request.kind === 'Reimburse' ||
      request.stage === 'Verifikasi laporan F-17')
  );
}
export function decideRequest(
  request: FinanceRequest,
  status: RequestStatus,
  reason: string,
): FinanceRequest {
  if (!canDecide(request))
    throw new Error('Pengajuan ini tidak dapat diputuskan oleh Finance.');
  if (status === 'Ditolak' && !reason.trim())
    throw new Error('Alasan penolakan wajib diisi.');
  if (status === 'Menunggu') throw new Error('Keputusan tidak valid.');
  return {
    ...request,
    status,
    stage:
      status === 'Ditolak'
        ? reason.trim()
        : request.kind === 'PJD'
          ? 'Menunggu atasan · F-17'
          : 'Selesai ditinjau',
  };
}
export async function downloadReport(
  requests: FinanceRequest[],
  month: string,
) {
  const { default: writeExcelFile } = await import('write-excel-file/browser');
  const headers = [
    'ID',
    'Tanggal',
    'Pengaju',
    'Jenis',
    'Nominal',
    'Persetujuan',
    'Pembayaran',
  ];
  const rows = requests
    .filter((request) => request.date.startsWith(month))
    .map((request) => [
      { type: String, value: request.id },
      { type: String, value: request.date },
      { type: String, value: request.name },
      { type: String, value: request.kind },
      { type: Number, value: request.amount, format: '#,##0' },
      { type: String, value: request.status },
      { type: String, value: request.paid ? 'Lunas' : 'Belum lunas' },
    ]);
  await writeExcelFile(
    [
      headers.map((value) => ({
        type: String,
        value,
        fontWeight: 'bold' as const,
      })),
      ...rows,
    ],
    { sheet: 'Rekap demo' },
  ).toFile(`rekap-demo-${month}.xlsx`);
}
