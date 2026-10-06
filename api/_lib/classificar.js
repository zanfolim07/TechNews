import { EDITORIA_PADRAO, EDITORIAS } from '../../config/editorias.js'
import { normalizar, temPalavra } from './texto.js'

export function classificar(titulo, categorias, padrao = EDITORIA_PADRAO) {
  const texto = normalizar(`${titulo} ${categorias.join(' ')}`)

  let melhor = padrao
  let maisPalavras = 0
  for (const editoria of EDITORIAS) {
    if (editoria.slug === 'tecnologia') continue
    const encontradas = editoria.palavras.filter((p) => temPalavra(texto, p)).length
    if (encontradas > maisPalavras) {
      melhor = editoria.slug
      maisPalavras = encontradas
    }
  }
  return melhor
}
