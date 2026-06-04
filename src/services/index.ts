import {
  funcionarios as mockFunc,
  pacientes as mockPac,
  atendimentos as mockAtd,
  usuarios as mockUsu,
  logs as mockLogs,
} from "@/mocks/data";
import type { Funcionario, Paciente, Atendimento, Usuario, LogEntry, StatusAtendimento } from "@/types";

// In-memory mutable stores so the demo feels real within a session.
let _func = [...mockFunc];
let _pac = [...mockPac];
let _atd = [...mockAtd];
let _usu = [...mockUsu];
let _logs = [...mockLogs];

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

function pushLog(usuario: string, acao: string, detalhe: string) {
  _logs = [
    { id: uid(), data: new Date().toISOString(), usuario, acao, detalhe },
    ..._logs,
  ];
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

// Atendimentos
export async function listAtendimentos(filtro?: { data?: string; terapeutaId?: string }): Promise<Atendimento[]> {
  await delay();
  let list = _atd;
  if (filtro?.data) list = list.filter((a) => a.data === filtro.data);
  if (filtro?.terapeutaId) list = list.filter((a) => a.terapeutaId === filtro.terapeutaId);
  return list;
}
export async function saveAtendimento(a: Atendimento, usuario = "admin") {
  await delay();
  const exists = _atd.find((x) => x.id === a.id);
  if (exists) {
    _atd = _atd.map((x) => (x.id === a.id ? a : x));
    pushLog(usuario, "Agenda alterada", `Atendimento ${a.hora}`);
  } else {
    a.id = a.id || uid();
    _atd = [..._atd, a];
    pushLog(usuario, "Agenda criada", `Atendimento ${a.hora}`);
  }
  return a;
}
export async function removeAtendimento(id: string, usuario = "admin") {
  await delay();
  const item = _atd.find((x) => x.id === id);
  _atd = _atd.filter((x) => x.id !== id);
  if (item) pushLog(usuario, "Agenda removida", `Atendimento ${item.hora}`);
}
export async function atualizarStatusAtendimento(id: string, status: StatusAtendimento) {
  await delay(60);
  _atd = _atd.map((x) => (x.id === id ? { ...x, status } : x));
}

// Check-in: marca todos os atendimentos do paciente naquele dia como "presente"
export async function checkinPaciente(pacienteId: string, data: string, usuario = "recepcao") {
  await delay();
  let count = 0;
  _atd = _atd.map((a) => {
    if (a.pacienteId === pacienteId && a.data === data && a.status === "agendado") {
      count++;
      return { ...a, status: "presente" as StatusAtendimento };
    }
    return a;
  });
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
