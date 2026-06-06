export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value?: string | Date | null) {
  if (!value) return 'Data não informada';

  const date =
    value instanceof Date
      ? value
      : value.includes('T')
        ? new Date(value)
        : new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return 'Data inválida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}