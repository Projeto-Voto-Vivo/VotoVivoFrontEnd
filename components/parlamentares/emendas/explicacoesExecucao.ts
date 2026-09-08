/**
 * As etapas da execução de uma emenda, explicadas em português comum.
 *
 * A mesma etapa aparece com dois nomes na fonte — "Empenho" nos documentos,
 * "Empenhado" no valor — e as duas grafias caem na mesma explicação, porque
 * são a mesma coisa. Explicar nos cards de valor, e não em cada linha da
 * tabela, evita repetir o ícone uma vez por documento.
 */
export const EXPLICACOES_EXECUCAO: Record<string, string> = {
  empenho:
    'Primeira fase: o governo reserva o dinheiro no orçamento e se compromete a pagar. Nada saiu do caixa ainda — é uma promessa formal.',
  liquidacao:
    'Segunda fase: o governo confere que a obra foi feita ou o serviço entregue, e reconhece que a dívida é devida. O dinheiro continua no caixa.',
  pagamento:
    'Terceira e última fase: o dinheiro sai efetivamente dos cofres públicos e chega a quem recebeu. Só aqui o gasto de fato aconteceu.',

  // Restos a pagar: o que foi empenhado num ano e não chegou a ser pago nele.
  'restos inscritos':
    'Valor empenhado em anos anteriores que não foi pago dentro daquele ano e ficou pendente para os seguintes. Continua devido.',
  'restos cancelados':
    'Parte dos restos a pagar que o governo cancelou em vez de pagar — a obrigação deixou de existir e esse dinheiro não vai chegar ao destino.',
  'restos pagos':
    'Parte dos restos a pagar que foi efetivamente quitada depois, já fora do ano em que a despesa foi empenhada.',
};

function normalizar(valor: string) {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Explicação de um rótulo de execução, ou `undefined` se não conhecemos aquele
 * termo — melhor não explicar do que explicar errado.
 */
export function explicarExecucao(rotulo: string): string | undefined {
  const chave = normalizar(rotulo);

  return (
    EXPLICACOES_EXECUCAO[chave] ??
    // "Empenhado" → "empenho", "Liquidado" → "liquidacao", "Pago" → "pagamento".
    EXPLICACOES_EXECUCAO[
      { empenhado: 'empenho', liquidado: 'liquidacao', pago: 'pagamento' }[
        chave
      ] ?? ''
    ]
  );
}
