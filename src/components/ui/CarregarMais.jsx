import { ChevronDown, ChevronUp } from 'lucide-react'

export function CarregarMais({
  visiveis,
  total,
  passo,
  aoMudar,
  idLista,
  rotulo = 'Carregar mais notícias',
}) {
  if (total <= passo) return null

  function mostrarMenos() {
    aoMudar(passo)
    document.getElementById(idLista)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="carregar-mais">
      {visiveis < total && (
        <button
          type="button"
          className="btn btn--secundario btn--grande"
          aria-controls={idLista}
          onClick={() => aoMudar(visiveis + passo)}
        >
          {rotulo} <ChevronDown size={16} aria-hidden="true" />
        </button>
      )}
      {visiveis > passo && (
        <button
          type="button"
          className="btn btn--secundario btn--grande"
          aria-controls={idLista}
          onClick={mostrarMenos}
        >
          Mostrar menos <ChevronUp size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
