export function trocarParametro(params, chave, valor) {
  const novos = new URLSearchParams(params)
  if (valor) novos.set(chave, valor)
  else novos.delete(chave)
  return novos
}
