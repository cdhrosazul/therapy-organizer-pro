import {
  funcionarios as mockFunc,
  pacientes as mockPac,
  atendimentos as mockAtd,
  presencas as mockPres,
  usuarios as mockUsu,
  logs as mockLogs,
} from "@/mocks/data";
import type { Funcionario, Paciente, Atendimento, Presenca, Usuario, LogEntry, StatusPresenca, DiaSemana } from "@/types";
import { diaSemanaDe } from "@/lib/format";

let _func = [...mockFunc];
let _pac = [...mockPac];
let _atd = [...mockAtd];
let _pres = [...mockPres];
let _usu = [...mockUsu];
let _logs = [...mockLogs];

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

function pushLog(usuario: string, acao: string, detalhe: string) {
  _logs = [{ id: uid(), data: new Date().toISOString(), usuario, acao, detalhe }, ..._logs];
}

// Funcionários
export async function listFuncionarios(): Promise<Funcionario[]> {
  await delay();
  return _func;
}
export async function getFuncionario(id: string) {
  await delay();
  return _func.find((f) => f.id === id) ?? null;
}
export async function saveFuncionario(f: Funcionario, usuario = "admin") {
  await delay();
  const exists = _func.find((x) => x.id === f.id);
  if (exists) {
    _func = _func.map((x) => (x.id === f.id ? f : x));
    pushLog(usuario, "Cadastro alterado", `Funcionário ${f.nome}`);
  } else {
    f.id = f.id || uid();
    _func = [..._func, f];
    pushLog(usuario, "Cadastro criado", `Funcionário ${f.nome}`);
  }
  return f;
}

// Pacientes
export async function listPacientes(): Promise<Paciente[]> {
  await delay();
  return _pac;
}
export async function getPaciente(id: string) {
  await delay();
  return _pac.find((p) => p.id === id) ?? null;
}
export async function buscarPacientes(termo: string) {
  await delay(80);
  const t = termo.trim().toLowerCase();
  if (!t) return _pac;
  return _pac.filter((p) => p.nome.toLowerCase().includes(t));
}
export async function savePaciente(p: Paciente, usuario = "admin") {
  await delay();
  const exists = _pac.find((x) => x.id === p.id);
  if (exists) {
    _pac = _pac.map((x) => (x.id === p.id ? p : x));
    pushLog(usuario, "Cadastro alterado", `Paciente ${p.nome}`);
  } else {
    p.id = p.id || uid();
    _pac = [..._pac, p];
    pushLog(usuario, "Cadastro criado", `Paciente ${p.nome}`);
  }
  return p;
}

export async function removeFuncionario(id: string, usuario = "admin") {
  await delay();
  const func = _func.find((f) => f.id === id);
  const sessoes = _atd.filter((a) => a.terapeutaId === id);
  const sessoesIds = new Set(sessoes.map((s) => s.id));
  _atd = _atd.filter((a) => a.terapeutaId !== id);
  _pres = _pres.filter((p) => !sessoesIds.has(p.atendimentoId));
  _usu = _usu.filter((u) => u.funcionarioId !== id);
  _func = _func.filter((f) => f.id !== id);
  pushLog(usuario, "Funcionário excluído", `${func?.nome ?? id} (${sessoes.length} sessões fixas removidas)`);
}

export async function removePaciente(id: string, usuario = "admin") {
  await delay();
  const pac = _pac.find((p) => p.id === id);
  const sessoes = _atd.filter((a) => a.pacienteId === id);
  const sessoesIds = new Set(sessoes.map((s) => s.id));
  _atd = _atd.filter((a) => a.pacienteId !== id);
  _pres = _pres.filter((p) => !sessoesIds.has(p.atendimentoId));
  _pac = _pac.filter((p) => p.id !== id);
  pushLog(usuario, "Paciente excluído", `${pac?.nome ?? id} (${sessoes.length} sessões fixas removidas)`);
}

// Atendimentos (grade fixa semanal)
export async function listAtendimentos(filtro?: { diaSemana?: DiaSemana; terapeutaId?: string; pacienteId?: string }): Promise<Atendimento[]> {
  await delay();
  let list = _atd;
  if (filtro?.diaSemana) list = list.filter((a) => a.diaSemana === filtro.diaSemana);
  if (filtro?.terapeutaId) list = list.filter((a) => a.terapeutaId === filtro.terapeutaId);
  if (filtro?.pacienteId) list = list.filter((a) => a.pacienteId === filtro.pacienteId);
  return list;
}
export async function saveAtendimento(a: Atendimento, usuario = "admin") {
  await delay();
  const exists = _atd.find((x) => x.id === a.id);
  if (exists) {
    _atd = _atd.map((x) => (x.id === a.id ? a : x));
    pushLog(usuario, "Agenda alterada", `Slot fixo ${a.diaSemana} ${a.hora}`);
  } else {
    a.id = a.id || uid();
    _atd = [..._atd, a];
    pushLog(usuario, "Agenda criada", `Slot fixo ${a.diaSemana} ${a.hora}`);
  }
  return a;
}
export async function removeAtendimento(id: string, usuario = "admin") {
  await delay();
  const item = _atd.find((x) => x.id === id);
  _atd = _atd.filter((x) => x.id !== id);
  if (item) pushLog(usuario, "Agenda removida", `Slot fixo ${item.diaSemana} ${item.hora}`);
}

// Presenças (instâncias diárias sobre a grade fixa)
export async function listPresencas(filtro?: { data?: string; atendimentoId?: string }): Promise<Presenca[]> {
  await delay(60);
  let list = _pres;
  if (filtro?.data) list = list.filter((p) => p.data === filtro.data);
  if (filtro?.atendimentoId) list = list.filter((p) => p.atendimentoId === filtro.atendimentoId);
  return list;
}
export async function registrarPresenca(atendimentoId: string, data: string, status: StatusPresenca) {
  await delay(60);
  const existing = _pres.find((p) => p.atendimentoId === atendimentoId && p.data === data);
  if (existing) {
    _pres = _pres.map((p) => (p.id === existing.id ? { ...p, status } : p));
    return existing;
  }
  const novo: Presenca = { id: uid(), atendimentoId, data, status };
  _pres = [..._pres, novo];
  return novo;
}

// Check-in: marca presença para todos os atendimentos fixos do paciente no dia da semana de "data".
export async function checkinPaciente(pacienteId: string, data: string, usuario = "recepcao") {
  await delay();
  const dia = diaSemanaDe(data);
  if (!dia) return 0;
  const sessoes = _atd.filter((a) => a.pacienteId === pacienteId && a.diaSemana === dia);
  let count = 0;
  for (const s of sessoes) {
    const ja = _pres.find((p) => p.atendimentoId === s.id && p.data === data);
    if (ja && (ja.status === "presente" || ja.status === "concluido")) continue;
    if (ja) {
      _pres = _pres.map((p) => (p.id === ja.id ? { ...p, status: "presente" as StatusPresenca } : p));
    } else {
      _pres = [..._pres, { id: uid(), atendimentoId: s.id, data, status: "presente" }];
    }
    count++;
  }
  const pac = _pac.find((p) => p.id === pacienteId);
  pushLog(usuario, "Check-in", `Paciente ${pac?.nome ?? pacienteId} (${count} sessões)`);
  return count;
}

// Usuários
export async function listUsuarios(): Promise<Usuario[]> {
  await delay();
  return _usu;
}
export async function saveUsuario(u: Usuario, autor = "diretor") {
  await delay();
  const exists = _usu.find((x) => x.id === u.id);
  if (exists) {
    _usu = _usu.map((x) => (x.id === u.id ? u : x));
    pushLog(autor, "Usuário alterado", u.usuario);
  } else {
    u.id = u.id || uid();
    _usu = [..._usu, u];
    pushLog(autor, "Usuário criado", `Novo usuário: ${u.usuario}`);
  }
  return u;
}
export async function redefinirSenha(usuario: string, autor = "admin") {
  await delay();
  pushLog(autor, "Senha redefinida", `Usuário ${usuario}`);
}

// Logs
export async function listLogs(): Promise<LogEntry[]> {
  await delay();
  return _logs;
}
