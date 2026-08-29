export type HeaderMenuItem = {
  label: string;
  href: string;
};

export const parlamentaresItems: HeaderMenuItem[] = [
  {
    label: "Lista completa",
    href: "/parlamentares",
  },
  {
    label: "Deputados federais",
    href: "/parlamentares?tipo=deputados",
  },
  {
    label: "Senadores",
    href: "/parlamentares?tipo=senadores",
  },
];

export const educacaoItems: HeaderMenuItem[] = [
  {
    label: "Visão geral",
    href: "/educacao",
  },
  {
    label: "O Estado",
    href: "/educacao#estado",
  },
  {
    label: "Congresso Nacional",
    href: "/educacao#congresso",
  },
  {
    label: "Parlamentares",
    href: "/educacao#parlamentar",
  },
  {
    label: "Custos",
    href: "/educacao#custos",
  },
  {
    label: "Emendas",
    href: "/educacao#emendas",
  },
  {
    label: "Como nasce a lei",
    href: "/educacao#lei",
  },
  {
    label: "Sistema eleitoral",
    href: "/educacao#eleitoral",
  },
  {
    label: "Perguntas frequentes",
    href: "/educacao#faq",
  },
];