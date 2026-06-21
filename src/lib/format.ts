export function calcularIdade(iso: string): number {
  if (!iso) return 0;
  const nasc = new Date(iso);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function formatBRL(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatData(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR");
}

export function formatDataHora(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
}

export function slotsHorarios(): string[] {
  const slots: string[] = [];
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

export function hojeISO(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

import type { DiaSemana } from "@/types";

export const DIAS_SEMANA: { value: DiaSemana; label: string; labelCurto: string }[] = [
  { value: "seg", label: "Segunda-feira", labelCurto: "Segunda" },
  { value: "ter", label: "Terça-feira", labelCurto: "Terça" },
  { value: "qua", label: "Quarta-feira", labelCurto: "Quarta" },
  { value: "qui", label: "Quinta-feira", labelCurto: "Quinta" },
  { value: "sex", label: "Sexta-feira", labelCurto: "Sexta" },
];

export const DIAS_SEMANA_LOOKUP: Record<DiaSemana, { label: string; labelCurto: string }> = {
  seg: { label: "Segunda-feira", labelCurto: "Segunda" },
  ter: { label: "Terça-feira", labelCurto: "Terça" },
  qua: { label: "Quarta-feira", labelCurto: "Quarta" },
  qui: { label: "Quinta-feira", labelCurto: "Quinta" },
  sex: { label: "Sexta-feira", labelCurto: "Sexta" },
  sab: { label: "Sábado", labelCurto: "Sábado" },
  dom: { label: "Domingo", labelCurto: "Domingo" },
};

export function diaSemanaDe(iso: string): DiaSemana | null {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  const idx = d.getDay(); // 0=dom .. 6=sab
  const map: Record<number, DiaSemana> = {
    0: "dom",
    1: "seg",
    2: "ter",
    3: "qua",
    4: "qui",
    5: "sex",
    6: "sab",
  };
  return map[idx];
}

export function diaSemanaHoje(): DiaSemana {
  return diaSemanaDe(hojeISO()) ?? "seg";
}
