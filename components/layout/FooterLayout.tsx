import Link from 'next/link';

const navigationLinks = [
  { href: '/', label: 'Início' },
  { href: '/parlamentares', label: 'Parlamentares' },
  { href: '/educacao', label: 'Educação Política' },
  
];

const infoLinks = [
  { href: '/projeto', label: 'Sobre o projeto' },
  { href: '/projeto#fontes', label: 'Fontes dos dados' },
  { href: '/projeto#contato', label: 'Contato' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t-4 border-brasil-green bg-white text-gray-700">
      <div className="bg-neutral-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brasil-blue">
            Plataforma de acompanhamento legislativo
            </p>
        </div>
        </div>

      <div className="container mx-auto grid gap-10 px-4 py-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-3xl font-extrabold tracking-tighter text-brasil-blue transition-opacity hover:opacity-90"
            aria-label="Ir para a página inicial do VotoVivo.leg"
          >
            VotoVivo
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-600">
            Dados públicos organizados para transparência e educação cívica.
          </p>
        </div>

        <nav aria-label="Links principais do rodapé">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">
            Navegação
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {navigationLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-brasil-blue focus:outline-none focus:text-brasil-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Links institucionais do rodapé">
          <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900">
            Informações
          </h2>
          <ul className="mt-4 space-y-3 text-sm">
            {infoLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-brasil-blue focus:outline-none focus:text-brasil-blue"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-transparencia">
          <h2
            id="footer-transparencia"
            className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-900"
          >
            Transparência
          </h2>

          <div className="mt-2 space-y-2 text-xs leading-5 text-gray-600">
            <p>
              Este projeto utiliza dados abertos do Poder Legislativo para fins
              informativos. As informações podem sofrer atualização conforme a publicação nas
              bases oficiais.
            </p>

            <Link
              href='/projeto#fontes'
              className="inline-flex font-semibold text-brasil-blue transition-colors hover:text-blue-800"
            >
              Consultar fontes e metodologia
            </Link>
          </div>
        </section>
      </div>
      <section aria-label="footer-direitos">
          <div className="container mx-auto gap-3 px-4 py-4 text-xs text-gray-500 text-center">
          <p>© {currentYear} VotoVivo Todos os direitos reservados.</p>
        </div>
        </section>
    </footer>
  );
}