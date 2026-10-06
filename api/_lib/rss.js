import { createHash } from 'node:crypto'
import { XMLParser } from 'fast-xml-parser'
import { PALAVRAS_FORA_DO_TEMA } from '../../config/filtros.js'
import { classificar } from './classificar.js'
import { buscar } from './http.js'
import { cortar, decodificarEntidades, limparHtml, normalizar, temPalavra } from './texto.js'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  parseTagValue: false,

  isArray: (nome) =>
    ['item', 'entry', 'category', 'link', 'media:content', 'media:thumbnail', 'enclosure'].includes(
      nome,
    ),
})

function texto(valor) {
  if (typeof valor === 'string') return valor
  if (valor && typeof valor === 'object') {
    const obj = valor
    if (typeof obj['#text'] === 'string') return obj['#text']
    if (typeof obj['@_term'] === 'string') return obj['@_term']
  }
  return ''
}

function lista(valor) {
  return Array.isArray(valor) ? valor : []
}

function extrairLink(item) {
  for (const l of lista(item.link)) {
    if (typeof l === 'string' && l.trim()) return l.trim()
    const a = l
    if (a?.['@_href'] && (!a['@_rel'] || a['@_rel'] === 'alternate')) return a['@_href']
  }
  return ''
}

const EXTENSAO_IMAGEM = /\.(jpe?g|png|webp|gif|avif)(\?|$)/i

function imagemValida(url) {
  if (!url) return false
  try {
    const { protocol, hostname, pathname } = new URL(url)
    if (protocol !== 'https:' && protocol !== 'http:') return false
    if (/^\/[a-z0-9-]+(\.[a-z0-9-]+)+\//i.test(pathname)) return false
    if (/\/(themes|plugins|icons?|logos?|emoji|avatars?)\//i.test(pathname)) return false
    if (/\.svg$/i.test(pathname)) return false
    if (/gravatar|feedburner|doubleclick|s\.w\.org|pixel/i.test(hostname)) return false
    return true
  } catch {
    return false
  }
}

function imagensNoHtml(html) {
  const urls = []
  for (const m of html.matchAll(/<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    urls.push(decodificarEntidades(m[1]))
  }
  return urls
}

function extrairImagem(item) {
  const candidatas = [
    ...lista(item['media:content'])
      .filter((m) => m['@_medium'] === 'image' || EXTENSAO_IMAGEM.test(m['@_url'] ?? ''))
      .map((m) => m['@_url']),
    ...lista(item.enclosure)
      .filter((e) => e['@_type']?.startsWith('image/'))
      .map((e) => e['@_url']),
    ...lista(item['media:thumbnail']).map((t) => t['@_url']),
    ...imagensNoHtml(texto(item.description) || texto(item.summary)),
    ...imagensNoHtml(texto(item['content:encoded']) || texto(item.content)),
  ]
  return candidatas.find(imagemValida) ?? null
}

function gerarId(link) {
  return createHash('sha1').update(link).digest('hex').slice(0, 12)
}

const RODAPES = [
  /O post .{0,300} apareceu primeiro em .{0,80}\.?$/i,
  /The post .{0,300} appeared first on .{0,80}\.?$/i,
  /\[(…|\.\.\.)\]$/,
  /(Continue reading|Read more|Leia mais|Continue lendo)[.…]*$/i,
]

function secaoDoLink(link) {
  try {
    const partes = new URL(link).pathname.split('/').filter(Boolean)
    return partes.find((p) => !/^\d+$/.test(p))?.toLowerCase() ?? ''
  } catch {
    return ''
  }
}

function foraDoTema(titulo, link, fonte) {
  if (fonte.ignorarSecoes?.includes(secaoDoLink(link))) return true
  const t = normalizar(titulo)

  return PALAVRAS_FORA_DO_TEMA.some((p) => (/^[a-z0-9]/.test(p) ? temPalavra(t, p) : t.includes(p)))
}

function converterItem(item, fonte) {
  const titulo = decodificarEntidades(limparHtml(texto(item.title))).trim()
  const link = extrairLink(item)
  const data = new Date(
    texto(item.pubDate) || texto(item.published) || texto(item.updated) || texto(item['dc:date']),
  )

  if (!titulo || !link || Number.isNaN(data.getTime())) return null

  if (foraDoTema(titulo, link, fonte)) return null

  let resumo = limparHtml(texto(item.description) || texto(item.summary))
  for (const rodape of RODAPES) resumo = resumo.replace(rodape, '').trim()

  if (resumo.endsWith(titulo)) resumo = resumo.slice(0, -titulo.length).trim()

  const categorias = lista(item.category)
    .map((c) => decodificarEntidades(texto(c)).trim())
    .filter(Boolean)

  return {
    id: gerarId(link),
    titulo,
    link,
    resumo: cortar(resumo, 300),
    data: data.toISOString(),
    imagem: extrairImagem(item),
    editoria: classificar(titulo, categorias, fonte.editoriaPadrao),
    fonte: fonte.nome,
    fonteSlug: fonte.slug,
    idioma: fonte.idioma,
  }
}

export async function buscarFeed(fonte) {
  if (!fonte.feed) return []
  const resposta = await buscar(fonte.feed, {
    headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
  })

  const xml = parser.parse(await resposta.text())
  const itens = xml?.rss?.channel?.item ?? xml?.feed?.entry ?? []
  if (itens.length === 0) throw new Error('Feed sem itens')

  return itens.map((item) => converterItem(item, fonte)).filter((n) => n !== null)
}
