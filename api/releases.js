import { FERRAMENTAS } from '../config/ferramentas.js'
import { buscar, mensagemDeErro, respostaComCache } from './_lib/http.js'

const API = 'https://api.github.com'

async function github(caminho) {
  const cabecalhos = { Accept: 'application/vnd.github+json' }
  if (process.env.GITHUB_TOKEN) cabecalhos.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const resposta = await buscar(API + caminho, { headers: cabecalhos })
  return resposta.json()
}

function partesDaVersao(tag) {
  return tag.match(/\d+/g).slice(0, 3).map(Number)
}

function tipoDaVersao([, minor, patch = 0]) {
  if (minor === 0 && patch === 0) return 'Major'
  if (patch === 0) return 'Minor'
  return 'Patch'
}

function montarRelease(ferramenta, partes, data, link) {
  return {
    slug: ferramenta.slug,
    nome: ferramenta.nome,
    sigla: ferramenta.sigla,
    cor: ferramenta.cor,
    area: ferramenta.area,
    versao: partes.join('.'),
    tipo: tipoDaVersao(partes),
    data,
    link,
  }
}

async function viaReleases(ferramenta) {
  const release = await github(`/repos/${ferramenta.repo}/releases/latest`)
  return montarRelease(
    ferramenta,
    partesDaVersao(release.tag_name),
    release.published_at,
    release.html_url,
  )
}

async function viaTags(ferramenta) {
  const tags = await github(`/repos/${ferramenta.repo}/tags?per_page=100`)
  const estaveis = tags.filter((t) => ferramenta.filtroTag.test(t.name))

  estaveis.sort((a, b) => {
    const va = partesDaVersao(a.name)
    const vb = partesDaVersao(b.name)
    return vb[0] - va[0] || vb[1] - va[1] || (vb[2] ?? 0) - (va[2] ?? 0)
  })
  const maior = estaveis[0]
  const commit = await github(`/repos/${ferramenta.repo}/commits/${maior.commit.sha}`)

  const partes = partesDaVersao(maior.name)
  return montarRelease(
    ferramenta,
    partes,
    commit.commit.committer.date,
    ferramenta.changelog(partes.join('.')),
  )
}

const TRINTA_MINUTOS = 30 * 60 * 1000
let ultimaResposta = null

export async function GET() {
  if (
    ultimaResposta &&
    Date.now() - new Date(ultimaResposta.atualizadoEm).getTime() < TRINTA_MINUTOS
  ) {
    return respostaComCache(ultimaResposta)
  }

  const resultados = await Promise.allSettled(
    FERRAMENTAS.map((f) => (f.origem === 'tags' ? viaTags(f) : viaReleases(f))),
  )

  const releases = []
  const falhas = []
  resultados.forEach((resultado, i) => {
    if (resultado.status === 'fulfilled') releases.push(resultado.value)
    else falhas.push({ nome: FERRAMENTAS[i].nome, erro: mensagemDeErro(resultado.reason) })
  })

  releases.sort((a, b) => b.data.localeCompare(a.data))

  const corpo = { atualizadoEm: new Date().toISOString(), releases, falhas }
  if (falhas.length === 0) ultimaResposta = corpo
  return respostaComCache(corpo)
}
