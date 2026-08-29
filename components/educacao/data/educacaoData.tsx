import type { ReactNode } from "react";

import {
  Globe,
  Landmark,
  Briefcase,
  Wallet,
  FileText,
  HelpCircle,
  PenTool,
  Layers,
  Settings,
  Scale,
} from "lucide-react";

interface MenuItem {
  name: string;
  id: string;
  icon: ReactNode;
}

interface Poder {
  title: string;
  desc: string;
  bg: string;
  icon: ReactNode;
}

interface FAQ {
  q: string;
  a: string;
}

export const menuItems: MenuItem[] = [
  {
    name: "O Estado",
    id: "estado",
    icon: <Globe size={16} />,
  },
  {
    name: "Congresso Nacional",
    id: "congresso",
    icon: <Landmark size={16} />,
  },
  {
    name: "Parlamentares",
    id: "parlamentar",
    icon: <Briefcase size={16} />,
  },
  {
    name: "Custos",
    id: "custos",
    icon: <Wallet size={16} />,
  },
  {
    name: "Emendas",
    id: "emendas",
    icon: <FileText size={16} />,
  },
  {
    name: "Como nasce a Lei",
    id: "lei",
    icon: <PenTool size={16} />,
  },
  {
    name: "Sistema Eleitoral",
    id: "eleitoral",
    icon: <Layers size={16} />,
  },
  {
    name: "FAQ",
    id: "faq",
    icon: <HelpCircle size={16} />,
  },
];

export const poderes: Poder[] = [
  {
    title: "Poder Executivo",
    desc: "Responsável por implementar políticas públicas e executar as leis de forma concreta.",
    bg: "bg-gradient-to-r from-blue-700 to-blue-500",
    icon: <Settings size={28} />,
  },
  {
    title: "Poder Legislativo",
    desc: "Atua na criação de normas jurídicas e na fiscalização constante do Executivo.",
    bg: "bg-gradient-to-r from-green-700 to-green-500",
    icon: <FileText size={28} />,
  },
  {
    title: "Poder Judiciário",
    desc: "Garante o cumprimento das leis e a proteção dos direitos fundamentais dos cidadãos.",
    bg: "bg-gradient-to-r from-yellow-500 to-yellow-400",
    icon: <Scale size={28} />,
  },
];

export const faqs: FAQ[] = [
  {
    q: "Qual a diferença entre voto majoritário e proporcional?",
    a: "No sistema majoritário, vence quem tem mais votos, como Presidente e Senadores. No proporcional, as vagas são distribuídas entre os partidos conforme o total de votos recebidos pelo grupo político.",
  },
  {
    q: "Por que nem sempre o mais votado é eleito?",
    a: "Isso ocorre no sistema proporcional, usado para Deputados e Vereadores. Como os votos contam primeiro para o partido, um candidato muito votado pode contribuir para eleger outros candidatos da mesma legenda.",
  },
  {
    q: "Quanto custa um parlamentar por mês?",
    a: "O custo total, incluindo salário, equipe de assessores e cota para despesas, pode ultrapassar R$ 200 mil para deputados e chegar a mais de R$ 500 mil para senadores, conforme a estimativa apresentada nesta página.",
  },
  {
    q: "O que são emendas parlamentares?",
    a: "São recursos do orçamento público que deputados e senadores podem direcionar para obras, hospitais ou projetos específicos em suas regiões ou estados de origem.",
  },
  {
    q: "O que são as emendas PIX?",
    a: "É uma modalidade de transferência especial em que o recurso é enviado diretamente à prefeitura ou ao estado, sem um projeto detalhado previamente, o que gera debates sobre transparência e fiscalização.",
  },
  {
    q: "Quem cria as leis no Brasil?",
    a: "Principalmente o Poder Legislativo. No entanto, o Presidente e cidadãos, por meio de projetos de iniciativa popular, também podem propor novas leis.",
  },
  {
    q: "Qual a diferença entre deputado e senador?",
    a: "O deputado representa o povo e atua em temas sociais, legislativos e de fiscalização. O senador representa o estado ou o Distrito Federal e possui competências específicas, como aprovar autoridades.",
  },
  {
    q: "O que deve fazer um parlamentar na prática?",
    a: "Além de votar leis, deve trabalhar em comissões técnicas, fiscalizar o uso do dinheiro público e atender demandas da sociedade e de suas bases eleitorais.",
  },
];