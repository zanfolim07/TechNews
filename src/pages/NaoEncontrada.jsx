import { SearchX } from 'lucide-react'
import { Link } from 'react-router'
import { useTituloPagina } from '../hooks/useTituloPagina'

export function NaoEncontrada() {
  useTituloPagina('Página não encontrada')
  return (
    <div className="container" style={{ paddingTop: 48 }}>
      <div className="estado">
        <span className="estado__icone" aria-hidden="true">
          <SearchX size={24} strokeWidth={1.75} />
        </span>
        <span className="data">ERRO 404</span>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)' }}>Página não encontrada</h1>
        <p>
          O endereço pode estar errado ou a página foi removida. Que tal recomeçar pelo início ou
          buscar uma notícia?
        </p>
        <div className="estado__acoes">
          <Link to="/" className="btn btn--primario">
            Ir para o início
          </Link>
          <Link to="/busca" className="btn btn--secundario">
            Buscar notícias
          </Link>
        </div>
      </div>
    </div>
  )
}
