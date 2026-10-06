import { buscar, mensagemDeErro, respostaComCache } from './_lib/http.js'

const HN = 'https://hacker-news.firebaseio.com/v0'
const TABNEWS = 'https://www.tabnews.com.br/api/v1/contents'
const DIA = 24 * 60 * 60 * 1000
const TAMANHO_RANKING = 10

function dominio(url) {
  if (!url) return null
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

async function buscarHackerNews() {
  const [top, best] = await Promise.all([
    buscar(`${HN}/topstories.json`).then((r) => r.json()),
    buscar(`${HN}/beststories.json`).then((r) => r.json()),
  ])

  const ids = [...new Set([...top.slice(0, 30), ...best.slice(0, 30)])]
  const itens = await Promise.allSettled(
    ids.map((id) => buscar(`${HN}/item/${id}.json`, {}, 8_000).then((r) => r.json())),
  )

  const porId = new Map()
  for (const r of itens) {
    if (r.status !== 'fulfilled' || !r.value) continue
    const i = r.value
    if (i.type !== 'story' || !i.title || i.dead || i.deleted) continue
    porId.set(i.id, {
      id: `hn-${i.id}`,
      titulo: i.title,
      link: `https://news.ycombinator.com/item?id=${i.id}`,
      dominio: dominio(i.url),
      fonte: 'Hacker News',
      fonteSlug: 'hacker-news',
      pontos: i.score ?? 0,
      comentarios: i.descendants ?? 0,
      data: new Date(i.time * 1000).toISOString(),
    })
  }

  const daLista = (lista) => lista.map((id) => porId.get(id)).filter((i) => i !== undefined)

  return { hoje: daLista(top), semana: daLista(best) }
}

async function buscarTabNews() {
  const resposta = await buscar(`${TABNEWS}?strategy=relevant&per_page=100`)
  const conteudos = await resposta.json()

  return conteudos.map((c) => ({
    id: `tn-${c.id}`,
    titulo: c.title,
    link: `https://www.tabnews.com.br/${c.owner_username}/${c.slug}`,
    dominio: dominio(c.source_url ?? undefined),
    fonte: 'TabNews',
    fonteSlug: 'tabnews',
    pontos: c.tabcoins,
    comentarios: c.children_deep_count,
    data: c.published_at,
  }))
}

function ranquear(listas, desde) {
  const candidatos = listas.flatMap((lista) => {
    const doPeriodo = lista.filter((i) => new Date(i.data).getTime() >= desde)
    const maior = Math.max(1, ...doPeriodo.map((i) => i.pontos))
    return doPeriodo.map((item) => ({ item, relativa: item.pontos / maior }))
  })

  return candidatos
    .sort((a, b) => b.relativa - a.relativa || b.item.pontos - a.item.pontos)
    .slice(0, TAMANHO_RANKING)
    .map((c) => c.item)
}

export async function GET() {
  const [hn, tn] = await Promise.allSettled([buscarHackerNews(), buscarTabNews()])

  const fontes = [
    {
      slug: 'hacker-news',
      nome: 'Hacker News',
      ok: hn.status === 'fulfilled',
      total: hn.status === 'fulfilled' ? hn.value.semana.length : 0,
      erro: hn.status === 'rejected' ? mensagemDeErro(hn.reason) : undefined,
    },
    {
      slug: 'tabnews',
      nome: 'TabNews',
      ok: tn.status === 'fulfilled',
      total: tn.status === 'fulfilled' ? tn.value.length : 0,
      erro: tn.status === 'rejected' ? mensagemDeErro(tn.reason) : undefined,
    },
  ]
  for (const f of fontes) if (!f.ok) console.error(`[em-alta] Falha em ${f.nome}: ${f.erro}`)

  const hnHoje = hn.status === 'fulfilled' ? hn.value.hoje : []
  const hnSemana = hn.status === 'fulfilled' ? hn.value.semana : []
  const tabnews = tn.status === 'fulfilled' ? tn.value : []

  const agora = Date.now()
  const corpo = {
    atualizadoEm: new Date().toISOString(),
    fontes,
    hoje: ranquear([hnHoje, tabnews], agora - DIA),

    semana: ranquear(
      [[...hnSemana, ...hnHoje.filter((h) => !hnSemana.some((s) => s.id === h.id))], tabnews],
      agora - 7 * DIA,
    ),
  }
  return respostaComCache(corpo)
}
