import {
  siDocker,
  siKubernetes,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siRust,
  siTypescript,
  siVite,
} from 'simple-icons'
import { quadrado } from '../../lib/estilos'
import { SiglaLivre } from './Basicos'

const LOGOS = {
  react: siReact,
  nextjs: siNextdotjs,
  node: siNodedotjs,
  python: siPython,
  typescript: siTypescript,
  docker: siDocker,
  postgresql: siPostgresql,
  vite: siVite,
  kubernetes: siKubernetes,
  rust: siRust,
}

export function LogoFerramenta({ slug, sigla, cor, tamanho = 44 }) {
  const logo = LOGOS[slug]
  if (!logo) return <SiglaLivre sigla={sigla} cor={cor} tamanho={tamanho} />

  const estilo = quadrado(tamanho)
  return (
    <span className="logo-ferramenta" style={estilo} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill={`#${logo.hex}`}>
        <path d={logo.path} />
      </svg>
    </span>
  )
}
