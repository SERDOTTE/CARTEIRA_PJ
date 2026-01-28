export enum CompanyCategory {
  CAPTACAO = 'Captação',
  CREDITO = 'Crédito',
  SERVICOS = 'Serviços',
  ADIMPLENCIA = 'Adimplência',
}

export enum CompanyStatus {
  PROSPECCAO = 'Prospecção',
  FECHAMENTO = 'Fechamento',
  CONCLUIDO = 'Concluído',
}

export interface CategoryDetail {
  status: CompanyStatus;
  operationValue: number;
}

export interface Interaction {
  id: string;
  contactDate: string;
  notes: string;
  followUpDate: string;
}

export interface Company {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  industry: string;
  description: string;
  category: CompanyCategory[];
  categoryDetails: {
    [key in CompanyCategory]?: CategoryDetail;
  };
  interactions: Interaction[];
}
