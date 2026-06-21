import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-brasil-blue" />
        Carregando informações
      </div>
    </main>
  );
}
