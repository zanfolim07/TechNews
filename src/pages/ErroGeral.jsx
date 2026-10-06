import { TriangleAlert } from 'lucide-react'

export function ErroGeral() {
  return (
    <div className="container" style={{ paddingTop: 64 }}>
      <div className="estado estado--erro" role="alert">
        <span className="estado__icone" aria-hidden="true">
          <TriangleAlert size={24} strokeWidth={1.75} />
        </span>
        <h1 style={{ fontSize: 24 }}>Algo deu errado</h1>
        <p>Aconteceu um erro inesperado nesta página. Tente recarregar ou volte para o início.</p>
        <div className="estado__acoes">
          <button
            type="button"
            className="btn btn--primario"
            onClick={() => window.location.reload()}
          >
            Recarregar a página
          </button>
          <a href="/" className="btn btn--secundario">
            Ir para o início
          </a>
        </div>
      </div>
    </div>
  )
}
