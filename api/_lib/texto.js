const ENTIDADES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  hellip: '…',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  laquo: '«',
  raquo: '»',
  middot: '·',
  bull: '•',
  deg: '°',
  ordm: 'º',
  ordf: 'ª',
  copy: '©',
  reg: '®',
  trade: '™',
  euro: '€',
  times: '×',
}

Object.assign(ENTIDADES, {
  aacute: 'á',
  eacute: 'é',
  iacute: 'í',
  oacute: 'ó',
  uacute: 'ú',
  Aacute: 'Á',
  Eacute: 'É',
  Iacute: 'Í',
  Oacute: 'Ó',
  Uacute: 'Ú',
  agrave: 'à',
  Agrave: 'À',
  acirc: 'â',
  ecirc: 'ê',
  ocirc: 'ô',
  Acirc: 'Â',
  Ecirc: 'Ê',
  Ocirc: 'Ô',
  atilde: 'ã',
  otilde: 'õ',
  Atilde: 'Ã',
  Otilde: 'Õ',
  ccedil: 'ç',
  Ccedil: 'Ç',
  uuml: 'ü',
  ntilde: 'ñ',
})

export function decodificarEntidades(texto) {
  return texto.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (original, codigo) => {
    if (codigo[0] === '#') {
      const numero =
        codigo[1].toLowerCase() === 'x'
          ? parseInt(codigo.slice(2), 16)
          : parseInt(codigo.slice(1), 10)
      return Number.isFinite(numero) ? String.fromCodePoint(numero) : original
    }

    return ENTIDADES[codigo] ?? ENTIDADES[codigo.toLowerCase()] ?? original
  })
}

export function limparHtml(html) {
  const semTags = html.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ')

  return decodificarEntidades(decodificarEntidades(semTags))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?)])/g, '$1')
    .trim()
}

export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

export function escapar(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function temPalavra(texto, palavra) {
  const regex = new RegExp(`(^|[^a-z0-9])${escapar(normalizar(palavra))}($|[^a-z0-9])`)
  return regex.test(normalizar(texto))
}

export function comecaPalavra(texto, termo) {
  let de = texto.indexOf(termo)
  while (de !== -1) {
    if (de === 0 || !/[a-z0-9]/.test(texto[de - 1])) return true
    de = texto.indexOf(termo, de + 1)
  }
  return false
}

export function cortar(texto, limite = 300) {
  if (texto.length <= limite) return texto
  const corte = texto.slice(0, limite)
  const ultimoEspaco = corte.lastIndexOf(' ')
  const base = ultimoEspaco > limite * 0.6 ? corte.slice(0, ultimoEspaco) : corte

  return base.replace(/[\s.,;:!?–—-]+$/, '') + '…'
}
