import { buscarEditoria } from '../config/editorias.js'
import { buscarTodasAsNoticias } from './_lib/agregador.js'
import { respostaComCache } from './_lib/http.js'
import { comecaPalavra, normalizar } from './_lib/texto.js'

export async function GET(request) {
  const { noticias: todas, fontes } = await buscarTodasAsNoticias()
  let noticias = todas

  const params = new URL(request.url).searchParams
  const editoria = params.get('editoria')
  const fonte = params.get('fonte')
  const termos = normalizar(params.get('q') ?? '')
    .split(/\s+/)
    .filter(Boolean)

  if (editoria) {
    const slug =
      buscarEditoria(editoria)?.slug ??
      buscarEditoria(normalizar(editoria).replace(/\s+/g, '-'))?.slug
    noticias = noticias.filter((n) => n.editoria === slug)
  }
  if (fonte) noticias = noticias.filter((n) => n.fonteSlug === fonte)
  if (termos.length) {
    noticias = noticias.filter((n) => {
      const texto = normalizar(`${n.titulo} ${n.resumo}`)
      return termos.every((t) => comecaPalavra(texto, t))
    })
  }

  const corpo = {
    atualizadoEm: new Date().toISOString(),
    total: noticias.length,
    fontes,
    noticias,
  }
  return respostaComCache(corpo)
}
