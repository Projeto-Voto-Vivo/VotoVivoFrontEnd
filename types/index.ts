export interface Deputado {
  id: number;
  nomeParlamentar: string;
  siglaPartido: string;
  uf: string;
  urlFoto: string;
}

export interface Gabinete {
  sala: string;
  predio: string;
  telefone: string;
  email: string;
}

export interface RedeSocial {
  rede: string;
  url: string;
}

export interface DeputadoDetalhe extends Deputado {
  nomeCivil: string;
  dataNascimento: string;
  email: string;
  situacao: string;
  gabinete: Gabinete;
  redesSociais: RedeSocial[];
}

export interface Despesa {
  data: string;
  tipo: string;
  fornecedor: string;
  valor: number;
  urlDocumento: string;
}

export interface GastoResumo {
  tipoDespesa: string;
  total: number;
}

export const UFs = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];
