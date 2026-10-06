import { ChevronLeft, ChevronRight } from 'lucide-react'

function paginasVisiveis(atual, total) {
  const lista = []
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - atual) <= 1) lista.push(p)
    else if (lista[lista.length - 1] !== '…') lista.push('…')
  }
  return lista
}

export function Paginacao({ atual, total, aoMudar }) {
  if (total <= 1) return null
  return (
    <nav aria-label="Paginação" className="paginacao">
      <button
        type="button"
        className="btn btn--secundario btn--icone"
        aria-label="Página anterior"
        disabled={atual === 1}
        onClick={() => aoMudar(atual - 1)}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <div className="paginacao__numeros">
        {paginasVisiveis(atual, total).map((p, i) =>
          p === '…' ? (
            <span key={`r${i}`} className="paginacao__reticencias" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              className="paginacao__numero"
              aria-current={p === atual ? 'page' : undefined}
              aria-label={`Página ${p}`}
              onClick={() => aoMudar(p)}
            >
              {p}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        className="btn btn--secundario btn--icone"
        aria-label="Próxima página"
        disabled={atual === total}
        onClick={() => aoMudar(atual + 1)}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  )
}
