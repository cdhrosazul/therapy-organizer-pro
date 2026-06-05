import type { Funcionario, Paciente, Atendimento, Presenca, Usuario, LogEntry, Especialidade } from "@/types";

export const especialidades: Especialidade[] = [
  "Psicologia",
  "Psicopedagogia",
  "Fisioterapia",
  "Fonoaudiologia",
  "Terapia Ocupacional",
  "Psicomotricidade",
  "Musicoterapia",
];

export const convenios = ["Particular", "Unimed", "Bradesco Saúde", "Amil", "SulAmérica", "Hapvida"];

export const funcionarios: Funcionario[] = [
  {
    id: "f1",
    nome: "Ana Carolina Souza",
    dataNascimento: "1988-04-12",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    endereco: "Rua das Flores, 120 — Centro",
    telefone: "(11) 99888-1010",
    cargo: "Psicóloga",
    especialidade: "Psicologia",
    salario: 7800,
    escala: "Seg-Sex",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    status: "ativo",
    documentos: [
      { id: "d1", tipo: "RG", nomeArquivo: "rg-ana.pdf", tamanho: 245000, criadoEm: "2024-02-10" },
      { id: "d2", tipo: "Diploma", nomeArquivo: "diploma.pdf", tamanho: 890000, criadoEm: "2024-02-10" },
    ],
  },
  {
    id: "f2",
    nome: "Marcos Vinicius Lima",
    dataNascimento: "1992-08-22",
    cpf: "234.567.890-11",
    rg: "23.456.789-0",
    endereco: "Av. Brasil, 800 — Jardim",
    telefone: "(11) 99777-2020",
    cargo: "Fisioterapeuta",
    especialidade: "Fisioterapia",
    salario: 7200,
    escala: "Seg-Sex",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    status: "ativo",
    documentos: [],
  },
  {
    id: "f3",
    nome: "Juliana Pereira Castro",
    dataNascimento: "1990-11-30",
    cpf: "345.678.901-22",
    rg: "34.567.890-1",
    endereco: "Rua Acácias, 45",
    telefone: "(11) 99666-3030",
    cargo: "Fonoaudióloga",
    especialidade: "Fonoaudiologia",
    salario: 7500,
    escala: "Seg-Sáb",
    horarioEntrada: "08:00",
    horarioSaida: "14:00",
    status: "ativo",
    documentos: [],
  },
  {
    id: "f4",
    nome: "Rafael Mendes Oliveira",
    dataNascimento: "1985-06-15",
    cpf: "456.789.012-33",
    rg: "45.678.901-2",
    endereco: "Rua das Palmeiras, 220",
    telefone: "(11) 99555-4040",
    cargo: "Terapeuta Ocupacional",
    especialidade: "Terapia Ocupacional",
    salario: 7400,
    escala: "Ter-Sáb",
    horarioEntrada: "09:00",
    horarioSaida: "17:00",
    status: "ativo",
    documentos: [],
  },
  {
    id: "f5",
    nome: "Patrícia Gomes",
    dataNascimento: "1995-01-20",
    cpf: "567.890.123-44",
    rg: "56.789.012-3",
    endereco: "Rua Bela Vista, 77",
    telefone: "(11) 99444-5050",
    cargo: "Psicopedagoga",
    especialidade: "Psicopedagogia",
    salario: 6900,
    escala: "Seg-Sex",
    horarioEntrada: "13:00",
    horarioSaida: "17:00",
    status: "ativo",
    documentos: [],
  },
  {
    id: "f6",
    nome: "Beatriz Almeida (Recepção)",
    dataNascimento: "1998-07-08",
    cpf: "678.901.234-55",
    rg: "67.890.123-4",
    endereco: "Rua Verde, 12",
    telefone: "(11) 99333-6060",
    cargo: "Recepcionista",
    salario: 2800,
    escala: "Seg-Sex",
    horarioEntrada: "08:00",
    horarioSaida: "17:00",
    status: "ativo",
    documentos: [],
  },
];

export const pacientes: Paciente[] = [
  { id: "p1", nome: "Lucas Henrique Silva", dataNascimento: "2016-03-15", endereco: "Rua das Hortências, 88", telefone: "(11) 98888-1111", convenio: "Unimed", terapias: ["Psicologia", "Fonoaudiologia"], responsavel: "Marina Silva", documentos: [] },
  { id: "p2", nome: "Helena Castro Ribeiro", dataNascimento: "2014-09-02", endereco: "Av. Central, 1500", telefone: "(11) 98888-2222", convenio: "Bradesco Saúde", terapias: ["Terapia Ocupacional", "Psicomotricidade"], responsavel: "Júlia Ribeiro", documentos: [] },
  { id: "p3", nome: "Pedro Augusto Martins", dataNascimento: "2017-12-21", endereco: "Rua Azul, 33", telefone: "(11) 98888-3333", convenio: "Particular", terapias: ["Fonoaudiologia"], responsavel: "Roberta Martins", documentos: [] },
  { id: "p4", nome: "Sofia Mendes", dataNascimento: "2015-05-10", endereco: "Rua das Rosas, 5", telefone: "(11) 98888-4444", convenio: "Amil", terapias: ["Psicologia", "Psicopedagogia", "Musicoterapia"], responsavel: "Carla Mendes", documentos: [] },
  { id: "p5", nome: "Gabriel Souza Lima", dataNascimento: "2013-02-28", endereco: "Rua Tulipa, 102", telefone: "(11) 98888-5555", convenio: "SulAmérica", terapias: ["Fisioterapia"], responsavel: "Fernando Lima", documentos: [] },
  { id: "p6", nome: "Isabela Rocha", dataNascimento: "2018-08-14", endereco: "Rua Margaridas, 9", telefone: "(11) 98888-6666", convenio: "Unimed", terapias: ["Psicomotricidade", "Terapia Ocupacional"], responsavel: "Mariana Rocha", documentos: [] },
  { id: "p7", nome: "Theo Almeida", dataNascimento: "2019-11-03", endereco: "Rua Lírio, 17", telefone: "(11) 98888-7777", convenio: "Particular", terapias: ["Fonoaudiologia", "Musicoterapia"], responsavel: "Bruna Almeida", documentos: [] },
  { id: "p8", nome: "Valentina Cardoso", dataNascimento: "2016-06-25", endereco: "Av. Liberdade, 770", telefone: "(11) 98888-8888", convenio: "Hapvida", terapias: ["Psicologia"], responsavel: "Sergio Cardoso", documentos: [] },
];

// Grade fixa semanal: o que está aqui acontece toda semana naquele dia.
export const atendimentos: Atendimento[] = [
  // Segunda
  { id: "a-seg-1", diaSemana: "seg", hora: "08:00", pacienteId: "p1", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-seg-2", diaSemana: "seg", hora: "08:30", pacienteId: "p4", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-seg-3", diaSemana: "seg", hora: "09:00", pacienteId: "p3", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-seg-4", diaSemana: "seg", hora: "09:30", pacienteId: "p2", terapeutaId: "f4", terapia: "Terapia Ocupacional" },
  { id: "a-seg-5", diaSemana: "seg", hora: "10:00", pacienteId: "p5", terapeutaId: "f2", terapia: "Fisioterapia" },
  { id: "a-seg-6", diaSemana: "seg", hora: "10:30", pacienteId: "p6", terapeutaId: "f4", terapia: "Terapia Ocupacional" },
  { id: "a-seg-7", diaSemana: "seg", hora: "13:30", pacienteId: "p8", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-seg-8", diaSemana: "seg", hora: "14:00", pacienteId: "p1", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-seg-9", diaSemana: "seg", hora: "14:30", pacienteId: "p4", terapeutaId: "f5", terapia: "Psicopedagogia" },
  { id: "a-seg-10", diaSemana: "seg", hora: "15:00", pacienteId: "p2", terapeutaId: "f4", terapia: "Psicomotricidade" },

  // Terça
  { id: "a-ter-1", diaSemana: "ter", hora: "08:00", pacienteId: "p7", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-ter-2", diaSemana: "ter", hora: "08:30", pacienteId: "p5", terapeutaId: "f2", terapia: "Fisioterapia" },
  { id: "a-ter-3", diaSemana: "ter", hora: "09:00", pacienteId: "p8", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-ter-4", diaSemana: "ter", hora: "09:30", pacienteId: "p6", terapeutaId: "f4", terapia: "Psicomotricidade" },
  { id: "a-ter-5", diaSemana: "ter", hora: "10:00", pacienteId: "p1", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-ter-6", diaSemana: "ter", hora: "13:30", pacienteId: "p3", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-ter-7", diaSemana: "ter", hora: "14:00", pacienteId: "p4", terapeutaId: "f5", terapia: "Musicoterapia" },
  { id: "a-ter-8", diaSemana: "ter", hora: "15:00", pacienteId: "p2", terapeutaId: "f4", terapia: "Terapia Ocupacional" },

  // Quarta
  { id: "a-qua-1", diaSemana: "qua", hora: "08:00", pacienteId: "p4", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-qua-2", diaSemana: "qua", hora: "08:30", pacienteId: "p7", terapeutaId: "f3", terapia: "Musicoterapia" },
  { id: "a-qua-3", diaSemana: "qua", hora: "09:00", pacienteId: "p5", terapeutaId: "f2", terapia: "Fisioterapia" },
  { id: "a-qua-4", diaSemana: "qua", hora: "09:30", pacienteId: "p1", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-qua-5", diaSemana: "qua", hora: "10:00", pacienteId: "p6", terapeutaId: "f4", terapia: "Terapia Ocupacional" },
  { id: "a-qua-6", diaSemana: "qua", hora: "13:30", pacienteId: "p4", terapeutaId: "f5", terapia: "Psicopedagogia" },
  { id: "a-qua-7", diaSemana: "qua", hora: "14:00", pacienteId: "p8", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-qua-8", diaSemana: "qua", hora: "15:00", pacienteId: "p2", terapeutaId: "f4", terapia: "Psicomotricidade" },

  // Quinta
  { id: "a-qui-1", diaSemana: "qui", hora: "08:00", pacienteId: "p1", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-qui-2", diaSemana: "qui", hora: "08:30", pacienteId: "p3", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-qui-3", diaSemana: "qui", hora: "09:00", pacienteId: "p5", terapeutaId: "f2", terapia: "Fisioterapia" },
  { id: "a-qui-4", diaSemana: "qui", hora: "09:30", pacienteId: "p6", terapeutaId: "f4", terapia: "Psicomotricidade" },
  { id: "a-qui-5", diaSemana: "qui", hora: "10:00", pacienteId: "p7", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-qui-6", diaSemana: "qui", hora: "13:30", pacienteId: "p4", terapeutaId: "f5", terapia: "Psicopedagogia" },
  { id: "a-qui-7", diaSemana: "qui", hora: "14:00", pacienteId: "p2", terapeutaId: "f4", terapia: "Terapia Ocupacional" },
  { id: "a-qui-8", diaSemana: "qui", hora: "15:00", pacienteId: "p8", terapeutaId: "f1", terapia: "Psicologia" },

  // Sexta
  { id: "a-sex-1", diaSemana: "sex", hora: "08:00", pacienteId: "p4", terapeutaId: "f1", terapia: "Psicologia" },
  { id: "a-sex-2", diaSemana: "sex", hora: "08:30", pacienteId: "p1", terapeutaId: "f3", terapia: "Fonoaudiologia" },
  { id: "a-sex-3", diaSemana: "sex", hora: "09:00", pacienteId: "p5", terapeutaId: "f2", terapia: "Fisioterapia" },
  { id: "a-sex-4", diaSemana: "sex", hora: "09:30", pacienteId: "p2", terapeutaId: "f4", terapia: "Terapia Ocupacional" },
  { id: "a-sex-5", diaSemana: "sex", hora: "10:00", pacienteId: "p7", terapeutaId: "f3", terapia: "Musicoterapia" },
  { id: "a-sex-6", diaSemana: "sex", hora: "13:30", pacienteId: "p6", terapeutaId: "f4", terapia: "Psicomotricidade" },
  { id: "a-sex-7", diaSemana: "sex", hora: "14:00", pacienteId: "p4", terapeutaId: "f5", terapia: "Musicoterapia" },
  { id: "a-sex-8", diaSemana: "sex", hora: "15:00", pacienteId: "p8", terapeutaId: "f1", terapia: "Psicologia" },
];

export const presencas: Presenca[] = [];

export const usuarios: Usuario[] = [
  { id: "u1", nome: "Carlos Diretor", usuario: "diretor", perfil: "diretor", ativo: true },
  { id: "u2", nome: "Beatriz Administrativo", usuario: "admin", perfil: "administrativo", funcionarioId: "f6", ativo: true },
  { id: "u3", nome: "Recepção 1", usuario: "recepcao", perfil: "recepcao", funcionarioId: "f6", ativo: true },
  { id: "u4", nome: "Ana Carolina (Psicologia)", usuario: "ana.psi", perfil: "terapeuta", funcionarioId: "f1", ativo: true },
];

export const logs: LogEntry[] = [
  { id: "l1", data: new Date(Date.now() - 1000 * 60 * 10).toISOString(), usuario: "admin", acao: "Check-in", detalhe: "Paciente Lucas Henrique Silva (Presente)" },
  { id: "l2", data: new Date(Date.now() - 1000 * 60 * 45).toISOString(), usuario: "diretor", acao: "Usuário criado", detalhe: "Novo usuário: ana.psi" },
  { id: "l3", data: new Date(Date.now() - 1000 * 60 * 120).toISOString(), usuario: "admin", acao: "Agenda alterada", detalhe: "Atendimento 09:30 — Helena" },
  { id: "l4", data: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), usuario: "admin", acao: "Cadastro alterado", detalhe: "Paciente Sofia Mendes" },
  { id: "l5", data: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), usuario: "diretor", acao: "Senha redefinida", detalhe: "Usuário ana.psi" },
];
