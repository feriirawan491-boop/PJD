import type { Metadata } from 'next';
import { Workspace } from '@/features/dashboard/workspace';
export const metadata: Metadata = { title: 'Masuk demo' };
export default function Page() {
  return <Workspace login />;
}
