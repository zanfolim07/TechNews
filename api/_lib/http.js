const USER_AGENT = 'TechNews/1.0 (agregador de noticias, projeto de estudo)'

export async function buscar(url, init = {}, limiteMs = 10_000) {
  const resposta = await fetch(url, {
    ...init,
    headers: { 'User-Agent': USER_AGENT, ...init.headers },
    signal: AbortSignal.timeout(limiteMs),
  })
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`)
  return resposta
}

export function respostaComCache(corpo) {
  return Response.json(corpo, {
    headers: { 'Cache-Control': 's-maxage=1800, stale-while-revalidate' },
  })
}

export function mensagemDeErro(motivo) {
  if (motivo instanceof Error) {
    return motivo.name === 'TimeoutError' ? 'Tempo esgotado' : motivo.message
  }
  return 'Erro desconhecido'
}
