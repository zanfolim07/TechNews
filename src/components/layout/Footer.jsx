import { Link } from 'react-router'
import { Logo } from './Logo'

const COLUNAS = [
  {
    titulo: 'Editorias',
    links: [
      ['Inteligência Artificial', '/editoria/inteligencia-artificial'],
      ['Programação', '/editoria/programacao'],
      ['Smartphones', '/editoria/smartphones'],
      ['Hardware', '/editoria/hardware'],
      ['Software', '/editoria/software'],
      ['Ciência', '/editoria/ciencia'],
    ],
  },
  {
    titulo: 'Portal',
    links: [
      ['Em alta', '/em-alta'],
      ['Releases', '/releases'],
      ['Glossário', '/glossario'],
      ['Busca', '/busca'],
    ],
  },
  {
    titulo: 'Projeto',
    links: [
      ['Como funciona', '/sobre'],
      ['Fontes', '/fontes'],
      ['Créditos das fontes', '/sobre#creditos'],
    ],
  },
]

export function Footer() {
  return (
    <footer className="rodape">
      <div className="container rodape__interno">
        <div className="rodape__grade">
          <div className="rodape__marca">
            <Logo clara />
            <p>
              Projeto de estudo que reúne notícias de tecnologia de vários portais, sempre com link
              para a matéria original.
            </p>
          </div>
          <div className="rodape__colunas">
            {COLUNAS.map((coluna) => (
              <nav key={coluna.titulo} aria-label={coluna.titulo} className="rodape__coluna">
                <h2>{coluna.titulo}</h2>
                <ul>
                  {coluna.links.map(([rotulo, para]) => (
                    <li key={para}>
                      <Link to={para}>{rotulo}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
        <div className="rodape__linha">
          <span>© 2026 Tech News · Projeto de estudo</span>
          <span>As notícias e imagens pertencem às suas fontes.</span>
        </div>
      </div>
    </footer>
  )
}
