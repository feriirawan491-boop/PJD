import {
  LayoutDashboard,
  ReceiptText,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  UsersRound,
  History,
} from 'lucide-react';
import type { Section } from '@/types/finance';
export const navigation: {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
  group: string;
}[] = [
  {
    id: 'overview',
    label: 'Ringkasan',
    icon: LayoutDashboard,
    group: 'Workspace',
  },
  {
    id: 'reimburse',
    label: 'Reimburse',
    icon: ReceiptText,
    group: 'Workspace',
  },
  {
    id: 'pjd',
    label: 'Perjalanan dinas',
    icon: BriefcaseBusiness,
    group: 'Workspace',
  },
  {
    id: 'reports',
    label: 'Rekap & laporan',
    icon: ChartNoAxesCombined,
    group: 'Workspace',
  },
  { id: 'users', label: 'Karyawan', icon: UsersRound, group: 'Administrasi' },
  {
    id: 'audit',
    label: 'Riwayat aktivitas',
    icon: History,
    group: 'Administrasi',
  },
];
