import { s as supabase } from "./client-XPspV5Wt.mjs";
function calcularIdade(iso) {
  if (!iso) return 0;
  const nasc = new Date(iso);
  const hoje = /* @__PURE__ */ new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || m === 0 && hoje.getDate() < nasc.getDate()) idade--;
  return idade;
}
function formatBRL(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDataHora(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
}
function slotsHorarios() {
  const slots = [];
  for (let h = 8; h < 12; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  for (let h = 13; h < 17; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
}
function hojeISO() {
  const d = /* @__PURE__ */ new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
const DIAS_SEMANA = [
  { value: "seg", label: "Segunda-feira", labelCurto: "Segunda" },
  { value: "ter", label: "Terça-feira", labelCurto: "Terça" },
  { value: "qua", label: "Quarta-feira", labelCurto: "Quarta" },
  { value: "qui", label: "Quinta-feira", labelCurto: "Quinta" },
  { value: "sex", label: "Sexta-feira", labelCurto: "Sexta" }
];
const DIAS_SEMANA_LOOKUP = {
  seg: { label: "Segunda-feira", labelCurto: "Segunda" },
  ter: { label: "Terça-feira", labelCurto: "Terça" },
  qua: { label: "Quarta-feira", labelCurto: "Quarta" },
  qui: { label: "Quinta-feira", labelCurto: "Quinta" },
  sex: { label: "Sexta-feira", labelCurto: "Sexta" },
  sab: { label: "Sábado", labelCurto: "Sábado" },
  dom: { label: "Domingo", labelCurto: "Domingo" }
};
function diaSemanaDe(iso) {
  if (!iso) return null;
  const d = /* @__PURE__ */ new Date(iso + "T12:00:00");
  const idx = d.getDay();
  const map = {
    0: "dom",
    1: "seg",
    2: "ter",
    3: "qua",
    4: "qui",
    5: "sex",
    6: "sab"
  };
  return map[idx];
}
function diaSemanaHoje() {
  return diaSemanaDe(hojeISO()) ?? "seg";
}
async function currentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
async function currentUserName() {
  const u = await currentUser();
  if (!u) return "—";
  const { data } = await supabase.from("profiles").select("nome").eq("id", u.id).maybeSingle();
  return data?.nome ?? u.email ?? "—";
}
async function pushLog(acao, detalhe, usuarioOverride) {
  const u = await currentUser();
  const usuario = u?.email ?? "sistema";
  await supabase.from("logs").insert({
    data: (/* @__PURE__ */ new Date()).toISOString(),
    usuario,
    acao,
    detalhe
  });
}
const funcFromDb = (d) => ({
  id: d.id,
  nome: d.nome,
  dataNascimento: d.data_nascimento ?? "",
  cpf: d.cpf ?? "",
  rg: d.rg ?? "",
  endereco: d.endereco ?? "",
  telefone: d.telefone ?? "",
  cargo: d.cargo,
  especialidade: d.especialidade ?? void 0,
  salario: d.salario ?? 0,
  escala: d.escala ?? "",
  horarioEntrada: d.horario_entrada ?? "",
  horarioSaida: d.horario_saida ?? "",
  status: d.status,
  documentos: d.documentos ?? []
});
const funcToDb = (f) => ({
  id: f.id || void 0,
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
  documentos: f.documentos ?? []
});
const pacFromDb = (d) => ({
  id: d.id,
  nome: d.nome,
  dataNascimento: d.data_nascimento ?? void 0,
  endereco: d.endereco ?? "",
  telefone: d.telefone ?? "",
  convenio: d.convenio ?? "",
  terapias: d.terapias ?? [],
  responsavel: d.responsavel ?? void 0,
  documentos: d.documentos ?? []
});
const pacToDb = (p) => ({
  id: p.id || void 0,
  nome: p.nome,
  data_nascimento: p.dataNascimento || null,
  endereco: p.endereco || null,
  telefone: p.telefone || null,
  convenio: p.convenio || null,
  terapias: p.terapias ?? [],
  responsavel: p.responsavel || null,
  documentos: p.documentos ?? []
});
const atdFromDb = (d) => ({
  id: d.id,
  diaSemana: d.dia_semana,
  hora: d.hora,
  pacienteId: d.paciente_id,
  terapeutaId: d.terapeuta_id,
  terapia: d.terapia,
  observacao: d.observacao ?? void 0
});
const atdToDb = (a) => ({
  id: a.id || void 0,
  dia_semana: a.diaSemana,
  hora: a.hora,
  paciente_id: a.pacienteId,
  terapeuta_id: a.terapeutaId,
  terapia: a.terapia,
  observacao: a.observacao ?? null
});
const presFromDb = (d) => ({
  id: d.id,
  atendimentoId: d.atendimento_id,
  data: d.data,
  status: d.status
});
const anotFromDb = (d) => ({
  id: d.id,
  pacienteId: d.paciente_id,
  autor: d.autor,
  autorNome: d.autor_nome,
  data: d.data,
  texto: d.texto
});
async function listFuncionarios() {
  const { data, error } = await supabase.from("funcionarios").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map((d) => funcFromDb(d));
}
async function getFuncionario(id) {
  const { data, error } = await supabase.from("funcionarios").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? funcFromDb(data) : null;
}
async function saveFuncionario(f) {
  const payload = funcToDb(f);
  if (f.id) {
    const { data: data2, error: error2 } = await supabase.from("funcionarios").update(payload).eq("id", f.id).select().single();
    if (error2) throw error2;
    await pushLog("Cadastro alterado", `Funcionário ${f.nome}`);
    return funcFromDb(data2);
  }
  const { data, error } = await supabase.from("funcionarios").insert(payload).select().single();
  if (error) throw error;
  await pushLog("Cadastro criado", `Funcionário ${f.nome}`);
  return funcFromDb(data);
}
async function removeFuncionario(id) {
  const { data: fn } = await supabase.from("funcionarios").select("nome").eq("id", id).maybeSingle();
  const { error } = await supabase.from("funcionarios").delete().eq("id", id);
  if (error) throw error;
  await pushLog("Funcionário excluído", `${fn?.nome ?? id}`);
}
async function listPacientes() {
  const { data, error } = await supabase.from("pacientes").select("*").order("nome");
  if (error) throw error;
  return (data ?? []).map((d) => pacFromDb(d));
}
async function getPaciente(id) {
  const { data, error } = await supabase.from("pacientes").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? pacFromDb(data) : null;
}
async function buscarPacientes(termo) {
  const t = termo.trim();
  let q = supabase.from("pacientes").select("*").order("nome");
  if (t) q = q.ilike("nome", `%${t}%`);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => pacFromDb(d));
}
async function savePaciente(p) {
  const payload = pacToDb(p);
  if (p.id) {
    const { data: data2, error: error2 } = await supabase.from("pacientes").update(payload).eq("id", p.id).select().single();
    if (error2) throw error2;
    await pushLog("Cadastro alterado", `Paciente ${p.nome}`);
    return pacFromDb(data2);
  }
  const { data, error } = await supabase.from("pacientes").insert(payload).select().single();
  if (error) throw error;
  await pushLog("Cadastro criado", `Paciente ${p.nome}`);
  return pacFromDb(data);
}
async function removePaciente(id) {
  const { data: pac } = await supabase.from("pacientes").select("nome").eq("id", id).maybeSingle();
  const { error } = await supabase.from("pacientes").delete().eq("id", id);
  if (error) throw error;
  await pushLog("Paciente excluído", `${pac?.nome ?? id}`);
}
async function listAnotacoes(filtro) {
  let q = supabase.from("anotacoes").select("*").order("data", { ascending: false });
  if (filtro?.pacienteId) q = q.eq("paciente_id", filtro.pacienteId);
  if (filtro?.pacienteIds && filtro.pacienteIds.length > 0) q = q.in("paciente_id", filtro.pacienteIds);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => anotFromDb(d));
}
async function saveAnotacao(a, _usuarioIgnored, autorNomeIn) {
  const u = await currentUser();
  if (!u) throw new Error("Não autenticado");
  if (a.id) {
    const { data: data2, error: error2 } = await supabase.from("anotacoes").update({ texto: a.texto }).eq("id", a.id).select().single();
    if (error2) throw error2;
    await pushLog("Anotação alterada", `Paciente ${a.pacienteId}`);
    return anotFromDb(data2);
  }
  const autorNome = autorNomeIn || await currentUserName();
  const { data, error } = await supabase.from("anotacoes").insert({
    paciente_id: a.pacienteId,
    autor: u.id,
    autor_nome: autorNome,
    data: (/* @__PURE__ */ new Date()).toISOString(),
    texto: a.texto
  }).select().single();
  if (error) throw error;
  await pushLog("Anotação criada", `Paciente ${a.pacienteId}`);
  return anotFromDb(data);
}
async function removeAnotacao(id) {
  const { data: n } = await supabase.from("anotacoes").select("paciente_id").eq("id", id).maybeSingle();
  const { error } = await supabase.from("anotacoes").delete().eq("id", id);
  if (error) throw error;
  if (n) await pushLog("Anotação removida", `Paciente ${n.paciente_id}`);
}
async function listAtendimentos(filtro) {
  let q = supabase.from("atendimentos").select("*").order("hora");
  if (filtro?.diaSemana) q = q.eq("dia_semana", filtro.diaSemana);
  if (filtro?.terapeutaId) q = q.eq("terapeuta_id", filtro.terapeutaId);
  if (filtro?.pacienteId) q = q.eq("paciente_id", filtro.pacienteId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => atdFromDb(d));
}
async function saveAtendimento(a) {
  const payload = atdToDb(a);
  if (a.id) {
    const { data: data2, error: error2 } = await supabase.from("atendimentos").update(payload).eq("id", a.id).select().single();
    if (error2) throw error2;
    await pushLog("Agenda alterada", `Slot fixo ${a.diaSemana} ${a.hora}`);
    return atdFromDb(data2);
  }
  const { data, error } = await supabase.from("atendimentos").insert(payload).select().single();
  if (error) throw error;
  await pushLog("Agenda criada", `Slot fixo ${a.diaSemana} ${a.hora}`);
  return atdFromDb(data);
}
async function removeAtendimento(id) {
  const { data: at } = await supabase.from("atendimentos").select("dia_semana, hora").eq("id", id).maybeSingle();
  const { error } = await supabase.from("atendimentos").delete().eq("id", id);
  if (error) throw error;
  if (at) await pushLog("Agenda removida", `Slot fixo ${at.dia_semana} ${at.hora}`);
}
async function listPresencas(filtro) {
  let q = supabase.from("presencas").select("*");
  if (filtro?.data) q = q.eq("data", filtro.data);
  if (filtro?.atendimentoId) q = q.eq("atendimento_id", filtro.atendimentoId);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []).map((d) => presFromDb(d));
}
async function checkinPaciente(pacienteId, data) {
  const dia = diaSemanaDe(data) ?? "seg";
  const { data: sessoes, error } = await supabase.from("atendimentos").select("id").eq("paciente_id", pacienteId).eq("dia_semana", dia);
  if (error) throw error;
  let count = 0;
  for (const s of sessoes ?? []) {
    const sid = s.id;
    const { data: ja } = await supabase.from("presencas").select("id, status").eq("atendimento_id", sid).eq("data", data).maybeSingle();
    const j = ja;
    if (j && (j.status === "presente" || j.status === "concluido")) continue;
    if (j) {
      const { error: upErr } = await supabase.from("presencas").update({ status: "presente" }).eq("id", j.id);
      if (upErr) throw upErr;
    } else {
      const { error: insErr } = await supabase.from("presencas").insert({ atendimento_id: sid, data, status: "presente" });
      if (insErr) throw insErr;
    }
    count++;
  }
  const { data: pac } = await supabase.from("pacientes").select("nome").eq("id", pacienteId).maybeSingle();
  await pushLog("Check-in", `Paciente ${pac?.nome ?? pacienteId} (${count} sessões)`);
  return count;
}
async function listLogs() {
  const { data, error } = await supabase.from("logs").select("*").order("data", { ascending: false }).limit(500);
  if (error) throw error;
  return (data ?? []).map((d) => ({
    id: d.id,
    data: d.data,
    usuario: d.usuario,
    acao: d.acao,
    detalhe: d.detalhe
  }));
}
export {
  DIAS_SEMANA as D,
  listAtendimentos as a,
  listPacientes as b,
  listLogs as c,
  diaSemanaHoje as d,
  DIAS_SEMANA_LOOKUP as e,
  formatDataHora as f,
  listPresencas as g,
  hojeISO as h,
  checkinPaciente as i,
  buscarPacientes as j,
  listAnotacoes as k,
  listFuncionarios as l,
  slotsHorarios as m,
  removeAtendimento as n,
  saveAtendimento as o,
  removePaciente as p,
  formatBRL as q,
  removeAnotacao as r,
  saveAnotacao as s,
  removeFuncionario as t,
  getPaciente as u,
  savePaciente as v,
  getFuncionario as w,
  calcularIdade as x,
  saveFuncionario as y
};
