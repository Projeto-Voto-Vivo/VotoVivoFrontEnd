'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UFs } from '@/types';

export function EstadoCard() {
  const router = useRouter();
  const [uf, setUf] = useState<string>('');

  function handleExplorar() {
    if (!uf) return;
    router.push(`/parlamentares?uf=${uf}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleExplorar();
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Cabeçalho */}
      <div className="border-b border-slate-100 p-5">
        <h3 className="text-base font-bold text-slate-900">
          Quem representa seu estado?
        </h3>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          Selecione uma UF para conhecer os parlamentares do seu estado.
        </p>
      </div>

      {/* Seletor */}
      <div className="flex flex-1 flex-col justify-between gap-4 p-5">
        <div className="space-y-2">
          <label
            htmlFor="uf-select"
            className="block text-sm font-semibold text-slate-700"
          >
            Estado (UF)
          </label>
          <select
            id="uf-select"
            value={uf}
            onChange={(e) => setUf(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brasil-blue focus:ring-2 focus:ring-brasil-blue/20"
            aria-label="Selecione o estado"
          >
            <option value="">Selecione um estado...</option>
            {UFs.map((sigla) => (
              <option key={sigla} value={sigla}>
                {sigla}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={handleExplorar}
          disabled={!uf}
          className="w-full rounded-xl bg-brasil-blue px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          aria-disabled={!uf}
        >
          Ver parlamentares →
        </button>
      </div>
    </div>
  );
}
