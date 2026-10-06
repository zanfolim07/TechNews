import { ArrowRight, Layers, Newspaper, Rss } from 'lucide-react'
import { Link, useSearchParams } from 'react-router'
import { nomeEditoria } from '../../config/editorias'
import { FONTES, NOME_IDIOMA } from '../../config/fontes'
import { CabecalhoPagina, Sigla, Trilha } from '../components/ui/Basicos'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { contarPorEditoria } from '../lib/analise'
import { useEmAlta, useNoticias } from '../lib/api'

function editoriasDaFonte(slug, noticias) {
  const contagem = contarPorEditoria(noticias.filter((n) => n.fonteSlug === slug))
  return Object.entries(contagem)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([editoria]) => nomeEditoria(editoria))
}

const IDIOMAS = [
  { valor: '', rotulo: 'Todas' },
  { valor: 'pt', rotulo: 'Português' },
  { valor: 'en', rotulo: 'Inglês' },
]

export function Fontes() {
  useTituloPagina('Fontes')
  const [params, setParams] = useSearchParams()
  const idioma = params.get('idioma') ?? ''
  const { dados } = useNoticias()
  const { dados: emAlta } = useEmAlta()

  function status(fonte) {
    const lista = fonte.feed ? dados?.fontes : emAlta?.fontes
    const s = lista?.find((f) => f.slug === fonte.slug)
    if (!s) return 'carregando'
    return s.ok ? 'ok' : 'erro'
  }

  const lista = FONTES.filter((f) => !idioma || f.idioma === idioma)

  return (
    <div className="container">
      <Trilha itens={[{ rotulo: 'Fontes' }]} />
      <CabecalhoPagina titulo="Fontes">
        Os portais que o Tech News acompanha. Toda notícia leva para o site que a publicou.
      </CabecalhoPagina>

      <div
        role="group"
        aria-label="Filtrar por idioma"
        className="chips"
        style={{ marginBottom: 28 }}
      >
        {IDIOMAS.map((i) => (
          <button
            key={i.valor}
            type="button"
            className="chip"
            aria-pressed={idioma === i.valor}
            onClick={() =>
              setParams(i.valor ? { idioma: i.valor } : {}, { preventScrollReset: true })
            }
          >
            {i.rotulo}
          </button>
        ))}
      </div>

      <ul className="grade grade--4">
        {lista.map((fonte) => {
          const situacao = status(fonte)
          const editorias =
            fonte.feed && dados
              ? editoriasDaFonte(fonte.slug, dados.noticias)
              : ['Programação', 'Carreira']
          return (
            <li key={fonte.slug} className="card cartao-fonte">
              <div className="cartao-fonte__topo">
                <Sigla fonteSlug={fonte.slug} tamanho={56} />
                <span className="etiqueta">{fonte.idioma.toUpperCase()}</span>
              </div>
              <div>
                <h2 className="card__titulo">
                  <Link
                    to={fonte.feed ? `/fontes/${fonte.slug}` : '/em-alta'}
                    className="card__link"
                  >
                    {fonte.nome}
                  </Link>
                </h2>
                <p className="cartao-fonte__descricao">{fonte.descricao}</p>
              </div>
              <div className="cartao-fonte__editorias">
                {editorias.map((e) => (
                  <span key={e} className="tag">
                    {e}
                  </span>
                ))}
              </div>
              <div className="cartao-fonte__rodape">
                <span className="status">
                  <span
                    className={`ponto ${situacao === 'erro' ? 'ponto--erro' : situacao === 'carregando' ? 'ponto--alerta' : ''}`}
                    aria-hidden="true"
                  />
                  {NOME_IDIOMA[fonte.idioma]} ·{' '}
                  {situacao === 'ok'
                    ? 'feed ativo'
                    : situacao === 'erro'
                      ? 'indisponível'
                      : 'verificando…'}
                </span>
                <span className="link-seta link-seta--suave">
                  {fonte.feed ? 'Ver notícias' : 'Ver ranking'}{' '}
                  <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </li>
          )
        })}
      </ul>

      <section aria-labelledby="como-chegam" className="como-chegam secao">
        <h2 id="como-chegam">Como as notícias chegam aqui</h2>
        <ol>
          <li>
            <Rss size={20} aria-hidden="true" />
            <h3>Leitura dos feeds</h3>
            <p>A cada 30 minutos, o Tech News lê o feed RSS de cada fonte.</p>
          </li>
          <li>
            <Layers size={20} aria-hidden="true" />
            <h3>Organização</h3>
            <p>As notícias são separadas por editoria e ordenadas por data.</p>
          </li>
          <li>
            <Newspaper size={20} aria-hidden="true" />
            <h3>Leitura na fonte</h3>
            <p>Você vê o resumo aqui e lê a matéria completa no site original.</p>
          </li>
        </ol>
      </section>
    </div>
  )
}
