'use client';

import { useSyncExternalStore } from 'react';

/** Mesmo breakpoint em que as abas do perfil ficam com dashboards ao lado. */
const TELA_LARGA = '(min-width: 1280px)';

function assinar(aoMudar: () => void) {
  const mq = window.matchMedia(TELA_LARGA);
  mq.addEventListener('change', aoMudar);
  return () => mq.removeEventListener('change', aoMudar);
}

function ehTelaLarga() {
  return window.matchMedia(TELA_LARGA).matches;
}

/**
 * Quantos itens por página a lista mostra: em tela larga ela é pareada com a
 * coluna de dashboards, então o tamanho acompanha a altura dela; no celular a
 * lista vem depois dos dashboards e fica curta.
 *
 * No servidor não há largura de tela: vale o tamanho do celular.
 */
export function useTamanhoPagina({ larga, celular }: { larga: number; celular: number }) {
  const telaLarga = useSyncExternalStore(assinar, ehTelaLarga, () => false);
  return telaLarga ? larga : celular;
}
