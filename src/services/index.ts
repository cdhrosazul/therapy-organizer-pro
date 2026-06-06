import { supabase } from "@/integrations/supabase/client";
import type {
  Funcionario,
  Paciente,
  Atendimento,
  Presenca,
  Usuario,
  LogEntry,
  StatusPresenca,
  DiaSemana,
  Anotacao,
  DocumentoArquivo,
  Especialidade,
} from "@/types";
import { diaSemanaDe } from "@/lib/format";

// ---------- helpers ----------

async function currentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

async function currentUserName(): Promise<string> {
  const u = await currentUser();
  if (!u) return "—";
  const { data } = await supabase.from("profiles").select("nome").eq("id", u.id).maybeSingle();
  return data?.nome ?? u.email ?? "—";
}

async function pushLog(acao: string, detalhe: string, usuarioOverride?: string) {
  const u = await currentUser();
  const usuario = usuarioOverride ?? u?.email ?? "sistema";
  await supabase.from("logs").insert({
    data: new Date().toISOString(),
    usuario,
    acao,
    detalhe,
  });
}

// ---------- mappers ----------

interface DbFuncionario {
  id: string;
  nome: string;
  data_nascimento: string | null;
  cpf: string | null;
  rg: string | null;
  endereco: string | null;
  telefone: string | null;
  cargo: string;
  especialidade: string | null;
  salario: number | null;
  escala: string | null;
  horario_entrada: string | null;
  horario_saida: string | null;
  status: "ativo" | "inativo" | "ferias";
  documentos: DocumentoArquivo[] | null;
}

const funcFromDb = (d: DbFuncionario): Funcionario => ({
  id: d.id,
  nome: d.nome,
  dataNascimento: d.data_nascimento ?? "",
  cpf: d.cpf ?? "",
  rg: d.rg ?? "",
  endereco: d.endereco ?? "",
  telefone: d.telefone ?? "",
  cargo: d.cargo,
  especialidade: (d.especialidade ?? undefined) as Especialidade | undefined,
  salario: d.salario ?? 0,
  escala: d.escala ?? "",
  horarioEntrada: d.horario_entrada ?? "",
  horarioSaida: d.horario_saida ?? "",
  status: d.status,
  documentos: d.documentos ?? [],
});

const funcToDb = (f: Funcionario) => ({
  id: f.id || undefined,
  nome: f.nome,
  data_nascimento: f.dataNascimento || null,
  cpf: f.cpf || null,
  rg: f.rg || null,
  endereco: f.endereco || null,
  telefone: f.telefone || null,
  cargo: f.cargo,
  especialidade: f.especialidade ?? null,
  salario: f.salario ?? 0,
  escala: f.escala || null,
  horario_entrada: f.horarioEntrada || null,
  horario_saida: f.horarioSaida || null,
  status: f.status,
  documentos: f.documentos ?? [],
});

interface DbPaciente {
  id: string;
  nome: string;
  data_nascimento: string | null;
  endereco: string | null;
  telefone: string | null;
  convenio: string | null;
  terapias: string[] | null;
  responsavel: string | null;
  documentos: DocumentoArquivo[] | null;
}

const pacFromDb = (d: DbPaciente): Paciente => ({
  id: d.id,
  nome: d.nome,
  dataNascimento: d.data_nascimento ?? undefined,
  endereco: d.endereco ?? "",
  telefone: d.telefone ?? "",
  convenio: d.convenio ?? "",
  terapias: (d.terapias ?? []) as Especialidade[],
  responsavel: d.responsavel ?? undefined,
  documentos: d.documentos ?? [],
});

const pacToDb = (p: Paciente) => ({
  id: p.id || undefined,
  nome: p.nome,
  data_nascimento: p.dataNascimento || null,
  endereco: p.endereco || null,
  telefone: p.telefone || null,
  convenio: p.convenio || null,
  terapias: p.terapias ?? [],
  responsavel: p.responsavel || null,
  documentos: p.documentos ?? [],
});

interface DbAtendimento {
  id: string;
  dia_semana: DiaSemana;
  hora: string;
  paciente_id: string;
  terapeuta_id: string;
  terapia: string;
  observacao: string | null;
}
const atdFromDb = (d: DbAtendimento): Atendimento => ({
  id: d.id,
  diaSemana: d.dia_semana,
  hora: d.hora,
  pacienteId: d.paciente_id,
  terapeutaId: d.terapeuta_id,
  terapia: d.terapia as Especialidade,
  observacao: d.observacao ?? undefined,
});
const atdToDb = (a: Atendimento) => ({
  id: a.id || undefined,
  dia_semana: a.diaSemana,
  hora: a.hora,
  paciente_id: a.pacienteId,
  terapeuta_id: a.terapeutaId,
  terapia: a.terapia,
  observacao: a.observacao ?? null,
});

interface DbPresenca {
  id: string;
  atendimento_id: string;
  data: string;
  status: StatusPresenca;
}
const presFromDb = (d: DbPresenca): Presenca => ({
  id: d.id,
  atendimentoId: d.atendimento_id,
  data: d.data,
  status: d.status,
});

interface DbAnotacao {
  id: string;
  paciente_id: string;
  autor: string;
  autor_nome: string;
  data: string;
  texto: string;
}
const anotFromDb = (d: DbAnotacao): Anotacao => ({
  id: d.id,
  pacienteId: d.paciente_id,
  autor: d.autor,
  autorNome: d.autor_nome,
  data: d.data,
  texto: d.texto,
});

interface DbProfile {
  id: string;
  nome: string;
  perfil: Usuario["perfil"];
  funcionario_id: string | null;
  ativo: boolean;
  email: string | null;
}
const profFromDb = (d: DbProfile): Usuario => ({
  id: d.id,
  nome: d.nome,
  usuario: d.email ?? "",
  perfil: d.perfil,
  funcionarioId: d.funcionario_id ?? undefined,
  ativo: d.ativo,
});

// ---------- Funcionários ----------

export async function listFuncionarios(): Promise<Funcionario[]> {
  const { data, error } = await supabase.from("funcionarios").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map((d) => funcFromDb(d as DbFuncionario));
}
export async function getFuncionario(id: string): Promise<Funcionario | null> {
  const { data, error } = await supabase.from("funcionarios").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? funcFromDb(data as DbFuncionario) : null;
}
export async function saveFuncionario(f: Funcionario): Promise<Funcionario> {
  const payload = funcToDb(f);
  if (f.id) {
    const { data, error } = await supabase.from("funcionarios").update(payload).eq("id", f.id).select().single();
    if (error) throw error;
    await pushLog("Cadastro alterado", `Funcionário ${f.nome}`);
    return funcFromDb(data as DbFuncionario);
  }
  const { data, error } = await supabase.from("funcionarios").insert(payload).select().single();
  if (error) throw error;
  await pushLog("Cadastro criado", `Funcionário ${f.nome}`);
  return funcFromDb(data as DbFuncionario);
}
export async function removeFuncionario(id: string): Promise<void> {
  const { data: fn } = await supabase.from("funcionarios").select("nome").eq("id", id).maybeSingle();
  const { error } = await supabase.from("funcionarios").delete().eq("id", id);
  if (error) throw error;
  await pushLog("Funcionário excluído", `${fn?.nome ?? id}`);
}

// ---------- Pacientes ----------

export async function listPacientes(): Promise<Paciente[]> {
  const { data, error } = await supabase.from("pacientes").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map((d) => pacFromDb(d as DbPaciente));
}
export async function getPaciente(id: string): Promise<Paciente | null> {
  const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? pacFromDb(data as DbPaciente) : null;
}
export async function buscarPacientes(termo: string): Promise<Paciente[]> {
  const t = termo.trim();
  let q = supabase.from("pacientes").select("*").order("nome");
  if (t) q = q.ilike("nome", `%${t}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => pacFromDb(d as DbPaciente));
}
export async function savePaciente(p: Paciente): Promise<Paciente> {
  const payload = pacToDb(p);
  if (p.id) {
    const { data, error } = await supabase.from("pacientes").update(payload).eq("id", p.id).select().single();
    if (error) throw error;
    await pushLog("Cadastro alterado", `Paciente ${p.nome}`);
    return pacFromDb(data as DbPaciente);
  }
  const { data, error } = await supabase.from("pacientes").insert(payload).select().single();
  if (error) throw error;
  await pushLog("Cadastro criado", `Paciente ${p.nome}`);
  return pacFromDb(data as DbPaciente);
}
export async function removePaciente(id: string): Promise<void> {
  const { data: pac } = await supabase.from("pacientes").select("nome").eq("id", id).maybeSingle();
  const { error } = await supabase.from("pacientes").delete().eq("id", id);
  if (error) throw error;
  await pushLog("Paciente excluído", `${pac?.nome ?? id}`);
}

// ---------- Anotações ----------

export async function listAnotacoes(filtro?: { pacienteId?: string; pacienteIds?: string[] }): Promise<Anotacao[]> {
  let q = supabase.from("anotacoes").select("*").order("data", { ascending: false });
  if (filtro?.pacienteId) q = q.eq("paciente_id", filtro.pacienteId);
  if (filtro?.pacienteIds && filtro.pacienteIds.length > 0) q = q.in("paciente_id", filtro.pacienteIds);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => anotFromDb(d as DbAnotacao));
}
export async function saveAnotacao(a: Anotacao, _usuarioIgnored?: string, autorNomeIn?: string): Promise<Anotacao> {
  const u = await currentUser();
  if (!u) throw new Error("Não autenticado");
  if (a.id) {
    const { data, error } = await supabase
      .from("anotacoes")
      .update({ texto: a.texto })
      .eq("id", a.id)
      .select()
      .single();
    if (error) throw error;
    await pushLog("Anotação alterada", `Paciente ${a.pacienteId}`);
    return anotFromDb(data as DbAnotacao);
  }
  const autorNome = autorNomeIn || (await currentUserName());
  const { data, error } = await supabase
    .from("anotacoes")
    .insert({
      paciente_id: a.pacienteId,
      autor: u.id,
      autor_nome: autorNome,
      data: new Date().toISOString(),
      texto: a.texto,
    })
    .select()
    .single();
  if (error) throw error;
  await pushLog("Anotação criada", `Paciente ${a.pacienteId}`);
  return anotFromDb(data as DbAnotacao);
}
export async function removeAnotacao(id: string): Promise<void> {
  const { data: n } = await supabase.from("anotacoes").select("paciente_id").eq("id", id).maybeSingle();
  const { error } = await supabase.from("anotacoes").delete().eq("id", id);
  if (error) throw error;
  if (n) await pushLog("Anotação removida", `Paciente ${n.paciente_id}`);
}

// ---------- Atendimentos ----------

export async function listAtendimentos(filtro?: {
  diaSemana?: DiaSemana;
  terapeutaId?: string;
  pacienteId?: string;
}): Promise<Atendimento[]> {
  let q = supabase.from("atendimentos").select("*").order("hora");
  if (filtro?.diaSemana) q = q.eq("dia_semana", filtro.diaSemana);
  if (filtro?.terapeutaId) q = q.eq("terapeuta_id", filtro.terapeutaId);
  if (filtro?.pacienteId) q = q.eq("paciente_id", filtro.pacienteId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => atdFromDb(d as DbAtendimento));
}
export async function saveAtendimento(a: Atendimento): Promise<Atendimento> {
  const payload = atdToDb(a);
  if (a.id) {
    const { data, error } = await supabase.from("atendimentos").update(payload).eq("id", a.id).select().single();
    if (error) throw error;
    await pushLog("Agenda alterada", `Slot fixo ${a.diaSemana} ${a.hora}`);
    return atdFromDb(data as DbAtendimento);
  }
  const { data, error } = await supabase.from("atendimentos").insert(payload).select().single();
  if (error) throw error;
  await pushLog("Agenda criada", `Slot fixo ${a.diaSemana} ${a.hora}`);
  return atdFromDb(data as DbAtendimento);
}
export async function removeAtendimento(id: string): Promise<void> {
  const { data: at } = await supabase.from("atendimentos").select("dia_semana, hora").eq("id", id).maybeSingle();
  const { error } = await supabase.from("atendimentos").delete().eq("id", id);
  if (error) throw error;
  if (at) await pushLog("Agenda removida", `Slot fixo ${at.dia_semana} ${at.hora}`);
}

// ---------- Presenças ----------

export async function listPresencas(filtro?: { data?: string; atendimentoId?: string }): Promise<Presenca[]> {
  let q = supabase.from("presencas").select("*");
  if (filtro?.data) q = q.eq("data", filtro.data);
  if (filtro?.atendimentoId) q = q.eq("atendimento_id", filtro.atendimentoId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => presFromDb(d as DbPresenca));
}
export async function registrarPresenca(atendimentoId: string, data: string, status: StatusPresenca): Promise<Presenca> {
  const { data: existing } = await supabase
    .from("presencas")
    .select("*")
    .eq("atendimento_id", atendimentoId)
    .eq("data", data)
    .maybeSingle();
  if (existing) {
    const { data: upd, error } = await supabase
      .from("presencas")
      .update({ status })
      .eq("id", (existing as DbPresenca).id)
      .select()
      .single();
    if (error) throw error;
    return presFromDb(upd as DbPresenca);
  }
  const { data: ins, error } = await supabase
    .from("presencas")
    .insert({ atendimento_id: atendimentoId, data, status })
    .select()
    .single();
  if (error) throw error;
  return presFromDb(ins as DbPresenca);
}
export async function checkinPaciente(pacienteId: string, data: string): Promise<number> {
  const dia = diaSemanaDe(data);
  if (!dia) return 0;
  const { data: sessoes, error } = await supabase
    .from("atendimentos")
    .select("id")
    .eq("paciente_id", pacienteId)
    .eq("dia_semana", dia);
  if (error) throw error;
  let count = 0;
  for (const s of sessoes ?? []) {
    const sid = (s as { id: string }).id;
    const { data: ja } = await supabase
      .from("presencas")
      .select("id, status")
      .eq("atendimento_id", sid)
      .eq("data", data)
      .maybeSingle();
    const j = ja as { id: string; status: StatusPresenca } | null;
    if (j && (j.status === "presente" || j.status === "concluido")) continue;
    if (j) {
      await supabase.from("presencas").update({ status: "presente" }).eq("id", j.id);
    } else {
      await supabase.from("presencas").insert({ atendimento_id: sid, data, status: "presente" });
    }
    count++;
  }
  const { data: pac } = await supabase.from("pacientes").select("nome").eq("id", pacienteId).maybeSingle();
  await pushLog("Check-in", `Paciente ${pac?.nome ?? pacienteId} (${count} sessões)`);
  return count;
}

// ---------- Usuários (profiles) ----------

export async function listUsuarios(): Promise<Usuario[]> {
  const { data, error } = await supabase.from("profiles").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map((d) => profFromDb(d as DbProfile));
}
export async function saveUsuario(u: Usuario): Promise<Usuario> {
  if (!u.id) {
    throw new Error(
      "Criação de novos usuários deve ser feita no Supabase Dashboard (Authentication → Add user). Depois ajuste o perfil aqui.",
    );
  }
  const { data, error } = await supabase
    .from("profiles")
    .update({
      nome: u.nome,
      perfil: u.perfil,
      funcionario_id: u.funcionarioId ?? null,
      ativo: u.ativo,
    })
    .eq("id", u.id)
    .select()
    .single();
  if (error) throw error;
  await pushLog("Usuário alterado", u.usuario);
  return profFromDb(data as DbProfile);
}
export async function redefinirSenha(usuario: string): Promise<void> {
  // usuario aqui é o email
  const { error } = await supabase.auth.resetPasswordForEmail(usuario, {
    redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
  });
  if (error) throw error;
  await pushLog("Senha redefinida", `Usuário ${usuario}`);
}

// ---------- Logs ----------

export async function listLogs(): Promise<LogEntry[]> {
  const { data, error } = await supabase.from("logs").select("*").order("data", { ascending: false }).limit(500);
  if (error) throw error;
  return (data ?? []).map((d) => ({
    id: (d as { id: string }).id,
    data: (d as { data: string }).data,
    usuario: (d as { usuario: string }).usuario,
    acao: (d as { acao: string }).acao,
    detalhe: (d as { detalhe: string }).detalhe,
  }));
}
