export type Section =
  'overview' | 'reimburse' | 'pjd' | 'reports' | 'users' | 'audit';
export type RequestStatus = 'Menunggu' | 'Disetujui' | 'Ditolak';
export interface FinanceRequest {
  id: string;
  name: string;
  initials: string;
  department: string;
  title: string;
  date: string;
  amount: number;
  status: RequestStatus;
  kind: 'Reimburse' | 'PJD';
  stage: string;
  paid: boolean;
  disbursed?: number;
  items: { label: string; amount: number }[];
}
export interface AuditEntry {
  id: string;
  requestId: string;
  actor: string;
  action: string;
  date: string;
  channel: string;
}
