import { ProjetoSection } from '@/components/projeto/ProjetoSection';

export const dynamic = 'force-dynamic';

export default function ProjetoPage() {
  return (
    <main className="scroll-mt-32 min-h-screen bg-slate-50">
      <ProjetoSection />
    </main>
  );
}
