
# Sistema de Gestão — Escola Rosazul (Front-end First)

Aplicação web profissional, totalmente navegável, com dados simulados (mock). Sem back-end, sem banco, sem autenticação real. Arquitetura modular preparada para integração futura com APIs.

## Identidade visual

- Paleta inspirada no logo: azul Rosazul (#1E78C2 aprox.) como primária, branco, cinzas neutros e estados semânticos (verde/azul/vermelho) para o check-in.
- Tipografia limpa (Inter), botões grandes, espaçamento generoso, foco em legibilidade para usuários com pouca familiaridade tecnológica.
- Logo Rosazul no login e na sidebar.

## Perfis e permissões (simuladas)

Seletor de perfil na tela de login (Diretor, Administrativo, Recepção, Terapeuta) — sem senha real. Cada perfil vê apenas seus menus:

- Diretor: tudo + gestão de usuários
- Administrativo: funcionários, pacientes, agenda, documentos, logs, dashboard
- Recepção: pacientes, agenda, check-in
- Terapeuta: apenas sua agenda e pacientes vinculados

## Telas / Rotas

```
/login                        Tela de login com logo e seletor de perfil
/dashboard                    KPIs do dia + agenda do dia (Diretor/Admin)
/funcionarios                 Lista + busca + status
/funcionarios/novo            Formulário completo (dados + documentos)
/funcionarios/$id             Detalhe/edição com abas (Dados | Documentos)
/pacientes                    Lista + busca por nome
/pacientes/novo               Formulário (dados + terapias + documentos)
/pacientes/$id                Detalhe com abas
/agenda                       Grade semanal 08–12 / 13–17, slots de 30min
/checkin                      Painel da recepção (busca + status visual)
/minha-agenda                 Visão exclusiva do terapeuta
/usuarios                     Gestão de usuários (Diretor)
/logs                         Histórico de ações (Diretor/Admin)
```

Rota raiz redireciona para /login; após "entrar" vai para /dashboard (ou /minha-agenda para terapeuta).

## Módulos detalhados

### Dashboard
Cards: Pacientes do dia, Presentes, Concluídos, Faltas. Agenda do dia em timeline. Atalhos rápidos.

### Funcionários
Tabela com filtros. Formulário com: dados pessoais (idade autocalculada do nascimento), cargo, especialidade, salário, escala, horários, status. Aba de Documentos com upload visual (RG, CPF, comprovante, diploma, certificados, contrato, currículo, foto) — aceita PDF/JPG/PNG; arquivos ficam apenas em memória.

### Pacientes
Lista com busca por nome. Formulário: dados básicos, convênio, múltiplas terapias (multi-select entre as 7 categorias). Upload de documentos (documento, carteirinha, laudos, relatórios, encaminhamentos, outros).

### Agenda
Grade tipo planilha: colunas = terapeutas (ou dias), linhas = slots de 30min das 08:00 às 12:00 e 13:00 às 17:00, com bloco visual de almoço. Clique em slot abre modal para agendar (paciente, terapeuta, terapia). Edição/remoção via modal. Terapeuta vê somente a própria coluna.

### Check-in
Busca grande pelo nome. Lista os atendimentos do paciente no dia. Botão único "Confirmar chegada" muda status para Presente (verde). Estados:
- Branco: não chegou
- Verde: presente
- Azul: concluído
- Vermelho: faltou

Após check-in, tela mostra "Próxima sessão" ao consultar novamente.

### Usuários (Diretor)
CRUD visual de usuários internos com seleção de perfil. Botão "Redefinir senha" (mock) disponível para Administrativo.

### Logs
Tabela cronológica com mock de eventos (criação de usuário, alteração de cadastro, check-in, alterações de agenda, redefinição de senha).

## Arquitetura de pastas

```
src/
  routes/                    rotas TanStack (login, dashboard, etc.)
  components/
    layout/                  Sidebar, Topbar, AppShell
    dashboard/               KPICard, TodayAgenda
    funcionarios/            FuncionarioForm, FuncionariosTable, DocumentsUploader
    pacientes/               PacienteForm, PacientesTable
    agenda/                  AgendaGrid, SlotCell, AppointmentModal
    checkin/                 CheckinSearch, CheckinCard, StatusBadge
    ui/                      shadcn (já existente)
  services/                  funcionarios.service.ts, pacientes.service.ts,
                             agenda.service.ts, checkin.service.ts,
                             usuarios.service.ts, logs.service.ts
                             (cada um expõe API assíncrona que hoje lê de /mocks
                              e amanhã troca para fetch real sem mudar UI)
  mocks/                     funcionarios.json, pacientes.json, agenda.json,
                             usuarios.json, logs.json
  types/                     funcionario.ts, paciente.ts, agenda.ts,
                             usuario.ts, perfil.ts, status.ts
  lib/
    auth/                    sessão simulada (perfil atual em memória/localStorage)
    permissions.ts           mapa de perfis -> permissões/menus
    date.ts                  utilitários (idade, slots de 30min)
```

Camada de serviços já assíncrona (`async function listPacientes(): Promise<Paciente[]>`) para que a futura troca por fetch seja transparente.

## Detalhes técnicos

- TanStack Start + Router (estrutura do template), Tailwind v4, shadcn/ui.
- Tokens de design em `src/styles.css` (primária azul Rosazul, neutros, estados).
- Logo carregado via Lovable Assets a partir do upload.
- Estado da "sessão" (perfil atual) em `localStorage` + contexto leve; menus renderizados condicionalmente por permissão.
- Mock data tipada; serviços retornam Promises (`await new Promise(r=>setTimeout(r,150))`) para simular latência.
- Sem Lovable Cloud, sem Supabase, sem APIs reais nesta fase.

## Fora do escopo (conforme spec)

Financeiro, faturamento, convênios, evolução clínica, SaaS multiempresa, banco de dados, APIs, JWT/OAuth, upload real, persistência definitiva, recuperação de senha por e-mail.

## Entregável

Aplicação navegável que parece um sistema real, com todos os fluxos operacionais clicáveis e arquitetura pronta para receber back-end na fase 2.
