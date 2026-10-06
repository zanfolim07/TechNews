import { ChevronDown, Menu, Search } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useNoticias } from '../../lib/api'
import { Logo } from './Logo'
import { MenuMobile } from './MenuMobile'

const NAV = [
  { rotulo: 'Início', para: '/' },
  { rotulo: 'IA', para: '/editoria/inteligencia-artificial' },
  { rotulo: 'Programação', para: '/editoria/programacao' },
  { rotulo: 'Software', para: '/editoria/software' },
  { rotulo: 'Segurança', para: '/editoria/seguranca' },
  { rotulo: 'Releases', para: '/releases' },
  { rotulo: 'Glossário', para: '/glossario' },
]

const MAIS_EDITORIAS = [
  { rotulo: 'Hardware', para: '/editoria/hardware' },
  { rotulo: 'Smartphones', para: '/editoria/smartphones' },
  { rotulo: 'Tecnologia', para: '/editoria/tecnologia' },
  { rotulo: 'Ciência', para: '/editoria/ciencia' },
  { rotulo: 'Carreira', para: '/editoria/carreira' },
  { rotulo: 'Internet', para: '/editoria/internet' },
]
const MAIS_PAGINAS = [
  { rotulo: 'Em alta', para: '/em-alta' },
  { rotulo: 'Fontes', para: '/fontes' },
  { rotulo: 'Sobre o projeto', para: '/sobre' },
]

export function Header() {
  const { dados } = useNoticias()
  const [menuAberto, setMenuAberto] = useState(false)
  const [maisAberto, setMaisAberto] = useState(false)

  return (
    <header className="cabecalho">
      <div className="container cabecalho__barra">
        <Logo />

        {}
        <nav aria-label="Principal" className="nav-principal">
          {NAV.map((item) => (
            <NavLink key={item.para} to={item.para} end className="nav-principal__item">
              {item.rotulo}
            </NavLink>
          ))}
          <div className="nav-mais">
            <button
              type="button"
              className="nav-principal__item"
              aria-expanded={maisAberto}
              aria-controls="menu-mais"
              onClick={() => setMaisAberto(!maisAberto)}
            >
              Mais
              <span className="nav-principal__seta" aria-hidden="true">
                <ChevronDown size={15} />
              </span>
            </button>
            {maisAberto && (
              <ul id="menu-mais" className="nav-mais__menu">
                {MAIS_EDITORIAS.map((item) => (
                  <li key={item.para}>
                    <NavLink to={item.para} onClick={() => setMaisAberto(false)}>
                      {item.rotulo}
                    </NavLink>
                  </li>
                ))}
                <li className="nav-mais__divisor" aria-hidden="true" />
                {MAIS_PAGINAS.map((item) => (
                  <li key={item.para}>
                    <NavLink to={item.para} onClick={() => setMaisAberto(false)}>
                      {item.rotulo}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        <div className="cabecalho__acoes">
          <Link to="/busca" className="busca-pilula">
            <Search size={17} aria-hidden="true" />
            Buscar notícias
          </Link>
          <Link to="/busca" className="busca-icone" aria-label="Buscar notícias">
            <Search size={18} aria-hidden="true" />
          </Link>
          <button
            type="button"
            className="menu-botao"
            aria-label="Abrir menu"
            aria-expanded={menuAberto}
            aria-controls="menu-mobile"
            onClick={() => setMenuAberto(true)}
          >
            <Menu size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {menuAberto && (
        <MenuMobile atualizadoEm={dados?.atualizadoEm} aoFechar={() => setMenuAberto(false)} />
      )}
    </header>
  )
}
