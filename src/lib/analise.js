import { EDITORIAS } from '../../config/editorias'
import { normalizar } from './texto'

const UMA_HORA = 60 * 60 * 1000

const PALAVRAS_VAZIAS = new Set(
  (
    'a o as os um uma de da do das dos em na no nas nos por para com sem sobre e ou que ' +
    'se ao aos como mais menos seu sua seus suas ele ela isso esse essa este esta sao ser ' +
    'vai tem ter foi novo nova novos novas agora hoje veja saiba confira ' +
    'the an of to in on for with and or is are was be by at from as it its this that ' +
    'how why what will can now new after into about your you our they has have not more'
  ).split(' '),
)

function palavrasChave(titulo) {
  return normalizar(titulo)
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((p) => p.length >= 3 && !PALAVRAS_VAZIAS.has(p))
}

function palavrasEmComum(tituloA, tituloB) {
  const b = palavrasChave(tituloB)
  return palavrasChave(tituloA).filter((p) => b.includes(p)).length
}

function mesmoAssuntoQue(noticiaA, noticiaB) {
  return palavrasEmComum(noticiaA.titulo, noticiaB.titulo) >= 2
}

function ultimasHoras(noticias, horas) {
  return noticias.filter((n) => Date.now() - new Date(n.data).getTime() <= horas * UMA_HORA)
}

export function agruparAssuntos(noticias) {
  const grupos = []
  for (const noticia of noticias) {
    const grupo = grupos.find((g) => mesmoAssuntoQue(g[0], noticia))
    if (grupo) grupo.push(noticia)
    else grupos.push([noticia])
  }
  return grupos
}

function quantasFontes(grupo) {
  return new Set(grupo.map((n) => n.fonteSlug)).size
}

export function porRelevancia(grupos) {
  return [...grupos].sort((a, b) => quantasFontes(b) - quantasFontes(a) || b.length - a.length)
}

export function resumoDoDia(noticias, quantidade = 5) {
  const escolhidas = []
  for (const grupo of porRelevancia(agruparAssuntos(ultimasHoras(noticias, 36)))) {
    const noticia = grupo.find((n) => n.imagem) ?? grupo[0]

    if (escolhidas.some((e) => mesmoAssuntoQue(e.noticia, noticia))) continue
    escolhidas.push({ noticia, fontes: quantasFontes(grupo) })
    if (escolhidas.length === quantidade) break
  }
  return escolhidas
}

export function destaques(noticias, jaNaTela, quantidade = 9) {
  const escolhidas = []
  const porFonte = {}

  for (const n of ultimasHoras(noticias, 48)) {
    if (!n.imagem || jaNaTela.some((x) => x.id === n.id)) continue
    if ((porFonte[n.fonteSlug] ?? 0) >= 2) continue

    const repetida = [...jaNaTela, ...escolhidas].some(
      (x) => mesmoAssuntoQue(x, n) || x.imagem === n.imagem,
    )
    if (repetida) continue

    escolhidas.push(n)
    porFonte[n.fonteSlug] = (porFonte[n.fonteSlug] ?? 0) + 1
    if (escolhidas.length === quantidade) break
  }
  return escolhidas
}

export function assuntosDoDia(noticias, quantidade = 7) {
  const contagem = {}
  for (const n of ultimasHoras(noticias, 24)) {
    const palavras = n.titulo.split(/[\s:;,.!?"“”()]+/).slice(1)
    for (const palavra of new Set(palavras)) {
      const temMaiuscula = /[A-ZÀ-Ú]/.test(palavra)
      if (temMaiuscula && palavra.length >= 3 && !PALAVRAS_VAZIAS.has(normalizar(palavra))) {
        contagem[palavra] = (contagem[palavra] ?? 0) + 1
      }
    }
  }
  return Object.entries(contagem)
    .filter(([, vezes]) => vezes >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, quantidade)
    .map(([palavra]) => palavra)
}

export function tendencias(noticias, quantidade = 4) {
  const semana = ultimasHoras(noticias, 24 * 7)
  return EDITORIAS.map((editoria) => ({
    editoria,
    noticias: semana.filter((n) => n.editoria === editoria.slug),
  }))
    .filter((t) => t.noticias.length >= 2)
    .sort((a, b) => b.noticias.length - a.noticias.length)
    .slice(0, quantidade)
}

export function mesmoAssunto(noticia, noticias, limite = 4) {
  return noticias
    .filter((n) => n.fonteSlug !== noticia.fonteSlug && mesmoAssuntoQue(n, noticia))
    .slice(0, limite)
}

export function relacionadas(noticia, noticias, ignorar, limite = 3) {
  return noticias
    .filter(
      (n) => n.editoria === noticia.editoria && n.id !== noticia.id && !ignorar.includes(n.id),
    )
    .sort(
      (a, b) =>
        palavrasEmComum(b.titulo, noticia.titulo) - palavrasEmComum(a.titulo, noticia.titulo),
    )
    .slice(0, limite)
}

export function contarPorEditoria(noticias) {
  const contagem = {}
  for (const n of noticias) contagem[n.editoria] = (contagem[n.editoria] ?? 0) + 1
  return contagem
}
