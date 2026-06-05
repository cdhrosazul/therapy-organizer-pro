## Mudança na Agenda: de "por data" para "fixa semanal"

Hoje a Agenda usa atendimentos vinculados a uma **data específica** (`data: YYYY-MM-DD`). Vamos trocar para o modelo da planilha do Drive: uma **grade fixa por dia da semana** (Segunda, Terça, Quarta, Quinta, Sexta), igual às abas da sua planilha. O que for marcado na Segunda vale para **toda segunda-feira**.

### Como vai funcionar

- A página `/agenda` passa a ter **5 abas no topo**: Segunda · Terça · Quarta · Quinta · Sexta (como na sua planilha).
- Cada aba mostra a grade fixa daquele dia da semana: terapeutas nas colunas, horários nas linhas (08:00–12:00 e 13:00–17:00, slots de 30 min, com intervalo de almoço).
- Ao clicar em "+ Agendar", o paciente fica **fixo naquele slot toda semana** naquele dia (ex.: Lucas, segundas 08:00 com Ana Carolina).
- Não existe mais o seletor de data na tela de Agenda — a grade é o "modelo padrão" da clínica.

### Impacto no Check-in

O Check-in continua sendo **do dia de hoje**. A diferença é que ele passa a ler da grade fixa: ao buscar um paciente, o sistema mostra as sessões que ele tem **no dia da semana de hoje** (ex.: hoje é quarta → mostra os horários fixos da quarta dele) e marca presença para a data de hoje.

### Impacto na Minha Agenda (terapeuta)

O terapeuta vê a mesma estrutura por dia da semana — sua grade fixa semanal, somente leitura.

### Fora de escopo desta mudança

- Exceções pontuais (paciente faltar num dia específico, trocar de horário só naquela semana, feriados) ficam para uma fase futura. Por enquanto a grade é o "padrão da clínica" e o Check-in registra presença/falta da data atual em cima dela.

---

### Detalhes técnicos

**Tipos (`src/types/index.ts`)**
- Novo tipo `DiaSemana = "seg" | "ter" | "qua" | "qui" | "sex"`.
- `Atendimento` deixa de ter `data: string` e passa a ter `diaSemana: DiaSemana`. Campos `hora`, `pacienteId`, `terapeutaId`, `terapia` permanecem.
- Novo tipo `Presenca { id, atendimentoId, data: YYYY-MM-DD, status: "presente" | "faltou" | "concluido" }` para registrar o que aconteceu em cada data real (usado pelo Check-in e pelos logs).

**Mocks (`src/mocks/data.ts`)**
- Reescrever `atendimentos` distribuindo os pacientes existentes pelos 5 dias da semana, em um padrão parecido com a planilha enviada (vários pacientes fixos por dia/terapeuta).

**Serviços (`src/services/index.ts`)**
- `listAtendimentos({ diaSemana?, terapeutaId? })` no lugar de filtrar por data.
- `saveAtendimento` / `removeAtendimento` operam sobre a grade semanal.
- `checkinPaciente(pacienteId, dataHoje)`: deriva o dia da semana de `dataHoje`, busca os atendimentos fixos do paciente nesse dia e cria registros em `presencas` com status `presente`.
- Nova `listPresencas({ data })` para o Check-in mostrar quem já fez check-in hoje.

**Rotas**
- `src/routes/agenda.tsx`: remover input de data, adicionar Tabs (shadcn) para os 5 dias da semana. Grade e modal seguem iguais, só trocando `data` por `diaSemana`.
- `src/routes/checkin.tsx`: deriva `diaSemana` da data de hoje; lista as sessões fixas do paciente daquele dia ao buscar.
- `src/routes/minha-agenda.tsx`: mesma estrutura de abas por dia da semana, só leitura.
- `src/routes/dashboard.tsx`: KPIs "Atendimentos de hoje" passam a contar os fixos do dia da semana atual.

**Helpers (`src/lib/format.ts`)**
- `diaSemanaDe(iso: string): DiaSemana` (segunda=`"seg"`, …).
- Constante `DIAS_SEMANA` com label/valor para os tabs.

Sábado/domingo não aparecem (clínica funciona seg–sex, igual à planilha). Se quiser incluir sábado depois, é só estender o enum.
