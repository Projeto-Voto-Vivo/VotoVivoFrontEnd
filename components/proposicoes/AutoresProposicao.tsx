import Link from 'next/link';
import { Info, Users } from 'lucide-react';
import { AutorProposicao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';

interface AutoresProposicaoProps {
  autores: AutorProposicao[];
}

export function AutoresProposicao({ autores }: AutoresProposicaoProps) {
  return (
    <SectionShell icon={<Users className="h-6 w-6" />} title="Autoria">
      {autores.length === 0 ? (
        <div className="flex items-start gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-800">Autoria não informada.</p>
            <p className="mt-1">
              A base registra autoria apenas de parlamentares
              (<code>autoriaProposicao</code>). Proposições do Executivo, do
              Judiciário, de comissões ou de iniciativa popular ficam sem autor
              identificado.
            </p>
          </div>
        </div>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {autores.map((autor, index) => {
            const rotulo = [autor.siglaPartido, autor.uf].filter(Boolean).join('/');
            const conteudo = (
              <>
                <span className="font-semibold text-slate-900">{autor.nome}</span>
                {rotulo ? <span className="text-slate-500"> · {rotulo}</span> : null}
              </>
            );

            return (
              <li key={`${autor.id ?? 'autor'}-${index}`}>
                {autor.id ? (
                  <Link
                    href={`/parlamentares/${autor.id}`}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition hover:border-brasil-blue hover:bg-white"
                  >
                    {conteudo}
                  </Link>
                ) : (
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
                    {conteudo}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </SectionShell>
  );
}
