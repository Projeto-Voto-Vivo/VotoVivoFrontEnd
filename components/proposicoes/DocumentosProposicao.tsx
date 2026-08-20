import { ExternalLink, FileText, Info } from 'lucide-react';
import { DocumentoProposicao } from '@/types';
import { SectionShell } from '@/components/parlamentares/profile/shared/SectionShell';
import { formatDate } from '@/components/parlamentares/profile/shared/formatters';

interface DocumentosProposicaoProps {
  documentos: DocumentoProposicao[];
  disponivel: boolean;
  urlFonteOficial: string | null;
}

export function DocumentosProposicao({
  documentos,
  disponivel,
  urlFonteOficial,
}: DocumentosProposicaoProps) {
  return (
    <SectionShell
      icon={<FileText className="h-6 w-6" />}
      title="Documentos"
      description="Inteiro teor, pareceres e relatórios anexados ao processo."
    >
      {!disponivel ? (
        <div className="flex items-start gap-3 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-600">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />
          <div>
            <p className="font-semibold text-slate-800">
              Os documentos desta proposição ainda não estão disponíveis aqui.
            </p>
            <p className="mt-1">
              O texto do projeto, os pareceres e os relatórios ainda não foram
              reunidos na nossa base. Por enquanto, eles podem ser consultados
              direto na fonte oficial.
            </p>
            {urlFonteOficial ? (
              <a
                href={urlFonteOficial}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-2 font-semibold text-brasil-blue hover:underline"
              >
                Consultar os documentos na fonte oficial
                <ExternalLink size={14} />
              </a>
            ) : null}
          </div>
        </div>
      ) : documentos.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500">
          Nenhum documento vinculado a esta proposição.
        </div>
      ) : (
        <ul className="space-y-3">
          {documentos.map((documento) => (
            <li
              key={documento.id}
              className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{documento.titulo}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {documento.tipo ?? 'Tipo não informado'}
                  {documento.data ? ` · ${formatDate(documento.data)}` : ''}
                </p>
              </div>

              {documento.url ? (
                <a
                  href={documento.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-2 rounded-xl bg-brasil-blue px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Abrir
                  <ExternalLink size={14} />
                </a>
              ) : (
                <span className="text-xs text-slate-400">Sem link disponível</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}
