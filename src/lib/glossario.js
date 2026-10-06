import lista from '../data/glossario.json'
import { comecaPalavra, normalizar, temPalavra } from './texto'

export const TERMOS = [...lista].sort((a, b) => a.termo.localeCompare(b.termo, 'pt-BR'))

export function termosNoTexto(texto) {
  return TERMOS.filter((t) => [t.termo, ...t.variantes].some((v) => temPalavra(texto, v)))
}

export function termoDoDia(hoje = new Date()) {
  const inicioDoAno = new Date(hoje.getFullYear(), 0, 0)
  const diaDoAno = Math.floor((hoje.getTime() - inicioDoAno.getTime()) / 86_400_000)
  return TERMOS[diaDoAno % TERMOS.length]
}

export function filtrarTermos(consulta) {
  const q = normalizar(consulta)
  if (!q) return TERMOS

  return TERMOS.filter((t) =>
    comecaPalavra(normalizar(`${t.termo} ${t.definicao} ${t.variantes.join(' ')} ${t.area}`), q),
  )
}
