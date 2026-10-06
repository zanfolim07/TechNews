import { ArrowRight, BookOpen, Layers, Package, Sparkles } from 'lucide-react'
import { Link } from 'react-router'
import { siGithub } from 'simple-icons'
import { LinkExterno } from '../components/ui/Basicos'
import { useTituloPagina } from '../hooks/useTituloPagina'

const AUTOR = {
  nome: 'Guilherme Zanfolim',
  github: 'https://github.com/zanfolim07',
  linkedin: 'https://www.linkedin.com/in/guilherme-zanfolim-202865315/',
}

const CAMINHO_LINKEDIN =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 4.773v6.288zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'

function IconeMarca({ caminho }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={caminho} />
    </svg>
  )
}

const PASSOS = [
  {
    titulo: 'Coleta',
    texto: 'A cada 30 minutos, o site lê os feeds RSS de portais de tecnologia confiáveis.',
  },
  {
    titulo: 'Organização',
    texto:
      'As notícias são agrupadas por editoria, ordenadas por data e ficam disponíveis na busca.',
  },
  {
    titulo: 'Leitura',
    texto: 'Você vê título, resumo e imagem aqui e segue para a matéria completa no site original.',
  },
]

const DIFERENCIAIS = [
  {
    Icone: Sparkles,
    titulo: 'Resumo do dia',
    texto: 'As 5 notícias mais importantes, para ler em um minuto.',
    para: '/',
  },
  {
    Icone: Layers,
    titulo: 'Várias fontes, um assunto',
    texto: 'Compare como cada portal cobriu a mesma notícia.',
    para: '/busca',
  },
  {
    Icone: Package,
    titulo: 'Releases',
    texto: 'Novas versões de React, Python, Docker e outras ferramentas.',
    para: '/releases',
  },
  {
    Icone: BookOpen,
    titulo: 'Glossário',
    texto: 'Termos técnicos explicados direto nas notícias.',
    para: '/glossario',
  },
]

export function Sobre() {
  useTituloPagina('Sobre o projeto')
  return (
    <div className="container sobre">
      <header className="pagina-topo sobre__topo">
        <span className="pagina-topo__rotulo">Sobre o projeto</span>
        <h1>As notícias de tecnologia, reunidas num só lugar.</h1>
        <p>
          O Tech News é um projeto de estudo que agrupa as manchetes de portais de tecnologia, para
          você acompanhar tudo sem abrir dez abas.
        </p>
      </header>

      <div className="sobre__duas-colunas">
        <section aria-labelledby="objetivo">
          <h2 id="objetivo">Objetivo</h2>
          <p>
            Praticar o desenvolvimento de um site real, do design ao deploy, resolvendo um problema
            comum: acompanhar notícias de tecnologia espalhadas por muitos sites.
          </p>
          <p>
            O resultado é um portal leve, que qualquer pessoa pode usar para se manter informada.
          </p>
        </section>
        <section aria-labelledby="creditos-titulo" id="creditos">
          <h2 id="creditos-titulo">Créditos</h2>
          <p>
            Todo o conteúdo exibido pertence às fontes originais. As notícias e imagens pertencem às
            suas fontes: o Tech News mostra apenas o que cada site disponibiliza em seu feed
            público e sempre direciona o leitor para a matéria completa.
          </p>
          <p>
            Feito com React e Vite, hospedado na Vercel. Ranking com dados do Hacker News e do
            TabNews; versões lidas da API do GitHub.
          </p>
        </section>
      </div>

      {}
      <section aria-labelledby="autor-titulo" className="secao autor">
        <span className="pagina-topo__rotulo">Desenvolvido por</span>
        <h2 id="autor-titulo">{AUTOR.nome}</h2>
        <p>
          Projeto de estudo desenvolvido por mim para praticar React, JavaScript e a criação de um
          site completo, do layout ao deploy.
        </p>
        <div className="autor__links">
          <LinkExterno href={AUTOR.github} className="btn btn--secundario">
            <IconeMarca caminho={siGithub.path} />
            GitHub
          </LinkExterno>
          {AUTOR.linkedin && (
            <LinkExterno href={AUTOR.linkedin} className="btn btn--secundario">
              <IconeMarca caminho={CAMINHO_LINKEDIN} />
              LinkedIn
            </LinkExterno>
          )}
        </div>
      </section>

      <section aria-labelledby="como-funciona" className="secao caixa-cinza">
        <h2 id="como-funciona">Como funciona</h2>
        <ol className="grade grade--3 passos">
          {PASSOS.map((p) => (
            <li key={p.titulo}>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="diferenciais" className="secao">
        <h2 id="diferenciais" style={{ marginBottom: 28 }}>
          O que o Tech News tem de diferente
        </h2>
        <ul className="grade grade--4">
          {DIFERENCIAIS.map(({ Icone, titulo, texto, para }) => (
            <li key={titulo} className="card diferencial">
              <span className="diferencial__icone" aria-hidden="true">
                <Icone size={20} />
              </span>
              <h3 className="card__titulo">
                <Link to={para} className="card__link">
                  {titulo}
                </Link>
              </h3>
              <p>{texto}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="conheca" className="secao nossas-fontes">
        <div className="nossas-fontes__texto">
          <h2 id="conheca">Conheça as fontes</h2>
          <p>Veja todos os portais que alimentam o Tech News.</p>
        </div>
        <Link to="/fontes" className="btn btn--primario btn--grande">
          Ver fontes <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
