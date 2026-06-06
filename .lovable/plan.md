## Excluir funcionário

Replicar o padrão já usado em pacientes para funcionários, com confirmação e limpeza em cascata.

### Onde aparece
- **Lista `/funcionarios`**: ícone de lixeira no canto direito de cada linha (ao lado do "Abrir"), visível no hover. Abre `AlertDialog`: "Excluir [Nome]? Esta ação remove o funcionário e todos os horários fixos em que ele é terapeuta."
- **Ficha `/funcionarios/$id`** (modo edição): botão "Excluir" (variante destrutiva) no header, ao lado do "Salvar". Mesma confirmação. Após excluir, navega para `/funcionarios`.

### O que a exclusão faz (cascata em `services`)
1. Remove todos os `Atendimento` em que `terapeutaId === id`.
2. Remove as `Presenca` órfãs (cujo `atendimentoId` foi apagado).
3. Remove o funcionário.
4. Opcional/seguro: também remove o `Usuario` vinculado (`usuario.funcionarioId === id`), já que perderia sentido.
5. Registra log: "Funcionário excluído — [Nome] (N sessões fixas removidas)".

### Mudanças
- `src/services/index.ts`: nova função `removeFuncionario(id, usuario)` com a cascata acima.
- `src/routes/funcionarios.index.tsx`: botão lixeira por linha + `AlertDialog` + `useMutation` + invalidação de `["funcionarios"]`.
- `src/routes/funcionarios.$id.tsx`: botão "Excluir" no header (só quando `!isNew`) + `AlertDialog` + navegação após sucesso.

### Fora de escopo
- Soft delete / restauração.
- Reatribuição automática de sessões a outro terapeuta (são removidas).
- Exclusão em massa.

Confirma para eu implementar?