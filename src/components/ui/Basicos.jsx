import { ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { buscarFonte } from '../../../config/fontes'
import { quadrado } from '../../lib/estilos'
import { tempoRelativo } from '../../lib/tempo'

export function SiglaLivre({ sigla, cor, tamanho = 24 }) {
  const estilo = { ...quadrado(tamanho), fontSize: tamanho * 0.36, background: cor }
  return (
    <span className="sigla" style={estilo} aria-hidden="true">
      {sigla}
    </span>
  )
}

export function Sigla({ fonteSlug, tamanho = 24 }) {
  const fonte = buscarFonte(fonteSlug)
  const [falhou, setFalhou] = useState(false)

  if (!fonte?.icone || falhou) {
    return <SiglaLivre sigla={fonte?.sigla ?? '?'} cor={fonte?.cor} tamanho={tamanho} />
  }
  const estilo = quadrado(tamanho)
  return (
    <img
      className="icone-fonte"
      style={estilo}
      src={fonte.icone}
      width={tamanho}
      height={tamanho}
      alt=""
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  )
}

export function Badge({ children, claro = false }) {
  return <span className={`badge ${claro ? 'badge--claro' : ''}`}>{children}</span>
}

export function BadgeTipo({ tipo }) {
  if (!tipo) return null
  return <span className={`tipo tipo--${tipo.toLowerCase()}`}>{tipo}</span>
}

export function AtualizadoHa({ quando, classe = '' }) {
  if (!quando) return null
  return (
    <span className={`status ${classe}`}>
      <span className="ponto" aria-hidden="true" />
      Atualizado {tempoRelativo(quando)}
    </span>
  )
}

export function Trilha({ itens }) {
  return (
    <nav aria-label="Trilha de navegação" className="trilha">
      <ol>
        <li>
          <Link to="/">Início</Link>
        </li>
        {itens.map((item) => (
          <li key={item.rotulo}>
            <ChevronRight size={14} className="trilha__seta" aria-hidden="true" />
            {item.para ? (
              <Link to={item.para}>{item.rotulo}</Link>
            ) : (
              <span aria-current="page">{item.rotulo}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function CabecalhoPagina({ titulo, rotulo = '', children = null }) {
  return (
    <header className="pagina-topo">
      {rotulo && <span className="pagina-topo__rotulo">{rotulo}</span>}
      <h1>{titulo}</h1>
      {children && <p>{children}</p>}
    </header>
  )
}

export function CabecalhoSecao({ titulo, id = undefined, descricao = '', children = null }) {
  return (
    <div className="secao__topo">
      <div>
        <h2 id={id}>{titulo}</h2>
        {descricao && <p>{descricao}</p>}
      </div>
      {children}
    </div>
  )
}

export function LinkExterno({ href, className = '', children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <span className="visualmente-oculto">(abre em nova aba)</span>
    </a>
  )
}
