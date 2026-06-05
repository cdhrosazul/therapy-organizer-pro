## Excluir paciente

Adicionar a ação de excluir paciente em dois lugares, com confirmação e limpeza dos dados relacionados.

### Onde aparece
- **Lista `/pacientes`**: ícone de lixeira no canto direito de cada linha (ao lado do chevron), visível no hover. Clique abre `AlertDialog` "Excluir [Nome]? Esta ação remove o paciente e todos os horários fixos vinculados."
- **Ficha `/pacientes/$id`** (modo edição): botão "Excluir paciente" (variante destrutiva, discreto) no rodapé do card, ao lado do Salvar. Mesma confirmação. Após excluir, navega de volta para `/pacientes`.

### O que a exclusão faz
Em cascata, no `services`:
1. Remove todos os `Atendimento` do paciente (`_atd.filter(a => a.pacienteId !== id)`).
2. Remove as `Presenca` órfãs (cujo `atendimentoId` foi apagado).
3. Remove o paciente.
4. Registra log: "Paciente excluído — [Nome] (N sessões fixas removidas)".

### Mudanças
- `src/services/index.ts`: nova função `removePaciente(id, usuario)` com a cascata acima.
- `src/routes/pacientes.index.tsx`: botão lixeira + `AlertDialog` + invalidação de `["pacientes:buscar"]`.
- `src/routes/pacientes.$id.tsx`: botão "Excluir paciente" (só quando `!isNew`) + `AlertDialog` + navegação após sucesso.

### Fora de escopo
- Soft delete / lixeira com restauração (exclusão é permanente nos mocks).
- Exclusão em massa.
