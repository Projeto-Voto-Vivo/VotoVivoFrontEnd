'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface VoltarLinkProps {
  /** Para onde ir quando não há página anterior dentro do site. */
  fallbackHref: string;
  className?: string;
}

/**
 * "Voltar" que volta de verdade.
 *
 * O link fixo para a lista de parlamentares mandava todo mundo para o mesmo
 * lugar: quem chegou a uma proposição pela busca era despejado numa lista de
 * gente. Aqui o padrão é a página anterior.
 *
 * `router.back()` sozinho não serve: quem abriu o link direto — de fora do
 * site, de uma aba nova, de um compartilhamento — não tem para onde voltar, e o
 * botão não faria nada. Por isso o histórico só é usado quando a página
 * anterior é deste site.
 *
 * A verificação acontece no clique, e não num efeito: `document.referrer` não
 * existe no servidor, e guardá-lo em estado só para escolher o destino
 * significaria uma renderização a mais em toda visita, por uma decisão que
 * importa uma vez só. O rótulo é sempre "Voltar" — verdadeiro nos dois
 * caminhos —, e o destino explícito fica no link ao lado.
 */
export function VoltarLink({ fallbackHref, className }: VoltarLinkProps) {
  const router = useRouter();

  function voltar() {
    let veioDeDentro = false;

    try {
      const referrer = document.referrer;
      veioDeDentro =
        Boolean(referrer) && new URL(referrer).origin === window.location.origin;
    } catch {
      // Referrer ausente ou malformado: trata como visita direta.
      veioDeDentro = false;
    }

    if (veioDeDentro) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  }

  return (
    <button
      type="button"
      onClick={voltar}
      className={
        className ??
        'inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-brasil-blue'
      }
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Voltar
    </button>
  );
}
