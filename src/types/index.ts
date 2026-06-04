export type Perfil = "diretor" | "administrativo" | "recepcao" | "terapeuta";

export type Especialidade =
  | "Psicologia"
  | "Psicopedagogia"
  | "Fisioterapia"
  | "Fonoaudiologia"
  | "Terapia Ocupacional"
  | "Psicomotricidade"
  | "Musicoterapia";

export interface Usuario {
  id: string;
  nome: string;
  usuario: string;
  perfil: Perfil;
  funcionarioId?: string;
  ativo: boolean;
}

export interface Funcionario {
  id: string;
  nome: string;
  dataNascimento: string; // ISO
  cpf: string;
  rg: string;
  endereco: string;
  telefone: string;
  cargo: string;
  especialidade?: Especialidade;
  salario: number;
  escala: string;
  horarioEntrada: string;
  horarioSaida: string;
  status: "ativo" | "inativo" | "ferias";
  documentos: DocumentoArquivo[];
}

export interface DocumentoArquivo {
  id: string;
  tipo: string;
  nomeArquivo: string;
  tamanho: number;
  criadoEm: string;
}

export interface Paciente {
  id: string;
  nome: string;
  dataNascimento?: string;
  endereco: string;
  telefone: string;
  convenio: string;
  terapias: Especialidade[];
  responsavel?: string;
  documentos: DocumentoArquivo[];
}

export type StatusAtendimento = "agendado" | "presente" | "concluido" | "faltou";

export interface Atendimento {
  id: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  pacienteId: string;
  terapeutaId: string;
  terapia: Especialidade;
  status: StatusAtendimento;
  observacao?: string;
}

export interface LogEntry {
  id: string;
  data: string; // ISO
  usuario: string;
  acao: string;
  detalhe: string;
}
