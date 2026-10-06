import { ChevronRight, Search, X } from 'lucide-react'
import { useEffect } from 'react'
import { Link, NavLink } from 'react-router'
import { EDITORIAS } from '../../../config/editorias'
import { AtualizadoHa } from '../ui/Basicos'
import { Logo } from './Logo'

const LINKS = [
  { rotulo: 'Início', para: '/' },
  { rotulo: 'Em alta', para: '/em-alta' },
  { rotulo: 'Releases', para: '/releases' },
  { rotulo: 'Glossário', para: '/glossario' },
  { rotulo: 'Fontes', para: '/fontes' },
  { rotulo: 'Sobre o projeto', para: '/sobre' },
]

export function MenuMobile({ aoFechar, atualizadoEm }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div
      id="menu-mobile"
      className="menu-mobile"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      onKeyDown={(e) => e.key === 'Escape' && aoFechar()}
    >
      <div className="menu-mobile__topo">
        <Logo aoClicar={aoFechar} />
        <button
          type="button"
          autoFocus
          className="menu-mobile__fechar"
          aria-label="Fechar menu"
          onClick={aoFechar}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="menu-mobile__corpo">
        <Link to="/busca" className="menu-mobile__busca" onClick={aoFechar}>
          <Search size={19} aria-hidden="true" />
          Buscar notícias
        </Link>

        <nav aria-label="Menu principal">
          {LINKS.map((l) => (
            <NavLink key={l.para} to={l.para} end className="menu-mobile__link" onClick={aoFechar}>
              {l.rotulo}
              <ChevronRight size={18} aria-hidden="true" />
            </NavLink>
          ))}
        </nav>

        <section aria-labelledby="menu-editorias">
          <h2 id="menu-editorias" className="rotulo" style={{ marginBottom: 14 }}>
            Editorias
          </h2>
          <div className="chips">
            {EDITORIAS.map((e) => (
              <NavLink key={e.slug} to={`/editoria/${e.slug}`} className="chip" onClick={aoFechar}>
                {e.nome}
              </NavLink>
            ))}
          </div>
        </section>

        <AtualizadoHa quando={atualizadoEm} />
      </div>
    </div>
  )
}
