import { FONTES_RSS } from '../../config/fontes.js'
import { mensagemDeErro } from './http.js'
import { buscarFeed } from './rss.js'

function chaveDoLink(link) {
  try {
    const url = new URL(link)
    for (const p of [...url.searchParams.keys()]) {
      if (/^(utm_|fbclid|gclid|ref$|source$)/i.test(p)) url.searchParams.delete(p)
    }
    const host = url.hostname.toLowerCase().replace(/^www\./, '')
    const caminho = url.pathname.replace(/\/+$/, '')
    const busca = url.searchParams.toString()
    return `${host}${caminho}${busca ? `?${busca}` : ''}`
  } catch {
    return link.trim().toLowerCase()
  }
}

const DIAS_MAXIMOS = 30
const MAXIMO_POR_FONTE = 25

function recentesDaFonte(noticias) {
  const limite = Date.now() - DIAS_MAXIMOS * 24 * 60 * 60 * 1000
  return noticias
    .filter((n) => new Date(n.data).getTime() >= limite)
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, MAXIMO_POR_FONTE)
}

export async function buscarTodasAsNoticias() {
  const resultados = await Promise.allSettled(FONTES_RSS.map((fonte) => buscarFeed(fonte)))

  const fontes = []
  const todas = []

  resultados.forEach((resultado, i) => {
    const fonte = FONTES_RSS[i]
    if (resultado.status === 'fulfilled') {
      const daFonte = recentesDaFonte(resultado.value)
      todas.push(...daFonte)
      fontes.push({ slug: fonte.slug, nome: fonte.nome, ok: true, total: daFonte.length })
    } else {
      console.error(`[noticias] Falha em ${fonte.nome}:`, resultado.reason)
      fontes.push({
        slug: fonte.slug,
        nome: fonte.nome,
        ok: false,
        total: 0,
        erro: mensagemDeErro(resultado.reason),
      })
    }
  })

  todas.sort((a, b) => b.data.localeCompare(a.data))

  const vistos = new Set()
  const noticias = todas.filter((n) => {
    const chave = chaveDoLink(n.link)
    if (vistos.has(chave)) return false
    vistos.add(chave)
    return true
  })

  return { noticias, fontes }
}
