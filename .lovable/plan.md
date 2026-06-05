## Vincular terapia ao paciente já cria o horário fixo na agenda

Hoje, na ficha do paciente, "Terapias vinculadas" é só uma lista de chips — marcar uma terapia não cria nada na agenda. Vamos transformar esse momento no ponto onde o horário fixo nasce.

### Como vai funcionar

**Ao clicar em uma terapia ainda não vinculada** (ex.: "Fisioterapia"):
- Abre um modal "Agendar Fisioterapia para [Paciente]" com:
  - **Terapeuta** — só lista os profissionais cuja especialidade é Fisioterapia.
  - **Dia da semana** — chips Segunda · Terça · Quarta · Quinta · Sexta.
  - **Horário** — chips de 30 em 30 minutos (08:00–12:00 e 13:00–17:00). Slots **já ocupados** pelo terapeuta naquele dia aparecem desabilitados, em cinza, com o nome do paciente que ocupa (ex.: "10:00 — ocupado por Lucas").
  - Botão **+ Adicionar outro horário** para repetir o bloco (ex.: paciente faz Fisio segunda 09:00 E quarta 09:00).
- Ao confirmar: cria os atendimentos fixos na grade semanal e adiciona a terapia ao paciente. A Agenda atualiza automaticamente (mesma query, invalidada).

**Ao clicar em uma terapia já vinculada**:
- Abre o mesmo modal mostrando os horários fixos atuais daquela terapia (lista editável: remover slot, adicionar novo). Permite também "Remover terapia" no rodapé — que apaga a terapia + todos os slots fixos dela na agenda (com confirmação).

**Feedback visual no chip da terapia**:
- Chip ativo passa a mostrar o número de sessões fixas vinculadas (ex.: "Fisioterapia · 2x").

### Onde a mudança vive

- `src/routes/pacientes.$id.tsx`: o chip de terapia abre o modal em vez de só toggleizar; a contagem `Nx` vem dos atendimentos do paciente.
- `src/components/TerapiaScheduleModal.tsx` (novo): UI do modal (terapeuta + lista de slots dia/hora + detecção de conflito).
- `src/services/index.ts`: já tem `saveAtendimento`/`removeAtendimento` e `listAtendimentos({ pacienteId })`. Sem mudanças aqui.

### Detalhes técnicos

- O modal carrega `listFuncionarios()` e filtra por `especialidade === terapia`.
- Carrega `listAtendimentos({ diaSemana })` sob demanda para marcar conflitos por terapeuta+hora.
- Ao confirmar, faz `saveAtendimento` em paralelo para cada slot adicionado, `removeAtendimento` para os removidos, e depois `savePaciente` com a lista final de terapias.
- Invalida queries `["atendimentos", diaSemana]`, `["atendimentos"]` e `["pacientes"]`.
- Conflito de horário (mesmo terapeuta, mesmo dia/hora) bloqueia o botão "Confirmar" com mensagem clara.

### Fora de escopo

- Repetição em datas específicas (já é fixo semanal por design).
- Sugestão automática do melhor horário/terapeuta.
- Edição em massa de vários pacientes ao mesmo tempo.
