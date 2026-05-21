import { Header } from '@/components/layout/HeaderLayout';
import { ProjetoSection } from '@/components/home/ProjetoSection';

export const dynamic = 'force-dynamic';

export default function ProjetoPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <ProjetoSection />
    </main>
  );
}
