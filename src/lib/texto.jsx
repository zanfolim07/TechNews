import { comecaPalavra, escapar, normalizar, temPalavra } from '../../api/_lib/texto'

export { comecaPalavra, normalizar, temPalavra }

export function palavrasDaBusca(consulta) {
  return normalizar(consulta).split(/\s+/).filter(Boolean)
}

export function destacar(texto, consulta) {
  const palavras = consulta.trim().split(/\s+/).filter(Boolean).map(escapar)
  if (palavras.length === 0) return texto

  const regex = new RegExp(`(${palavras.join('|')})`, 'gi')
  return texto
    .split(regex)
    .map((pedaco, i) => (i % 2 === 1 ? <mark key={i}>{pedaco}</mark> : pedaco))
}

export function encurtar(texto, palavras = 6) {
  const lista = texto.split(/\s+/)
  return lista.length <= palavras ? texto : `${lista.slice(0, palavras).join(' ')}…`
}

export function enderecoCurto(url) {
  const u = new URL(url)
  return u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/$/, '')
}
