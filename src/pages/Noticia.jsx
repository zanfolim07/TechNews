import { ArrowRight, ArrowUpRight, BookOpen, Info } from 'lucide-react'
import { useMemo } from 'react'
import { Link, useParams } from 'react-router'
import { nomeEditoria } from '../../config/editorias'
import { Badge, CabecalhoSecao, LinkExterno, Sigla, Trilha } from '../components/ui/Basicos'
import { BlocoEmAlta } from '../components/ui/Blocos'
import { CardNoticia, MiniNoticia } from '../components/ui/Cards'
import { Carregando, Esqueleto, EstadoErro, EstadoVazio } from '../components/ui/Estados'
import { Imagem } from '../components/ui/Imagem'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { mesmoAssunto, relacionadas } from '../lib/analise'
import { useNoticias } from '../lib/api'
import { termosNoTexto } from '../lib/glossario'
import { dataCompleta, tempoRelativo } from '../lib/tempo'
import { encurtar, enderecoCurto } from '../lib/texto'

export function Noticia() {
  const { id } = useParams()
  const { dados, erro, recarregar } = useNoticias()
  const noticia = dados?.noticias.find((n) => n.id === id)
  useTituloPagina(noticia?.titulo ?? (dados ? 'Notícia não encontrada' : 'Notícia'))

  if (erro) {
    return (
      <div className="container espaco-topo">
        <EstadoErro aoTentarDeNovo={recarregar} />
      </div>
    )
  }
  if (!dados) {
    return (
      <div className="container espaco-topo">
        <Carregando rotulo="Carregando notícia">
          <div style={{ display: 'grid', gap: 18, maxWidth: 900 }}>
            <Esqueleto largura="160px" altura={26} raio={999} />
            <Esqueleto altura={48} />
            <Esqueleto largura="70%" altura={48} />
            <Esqueleto altura={360} raio={20} />
          </div>
        </Carregando>
      </div>
    )
  }
  if (!noticia) {
    return (
      <div className="container espaco-topo">
        <EstadoVazio
          titulo="Notícia não encontrada"
          acoes={
            <>
              <Link to="/" className="btn btn--primario">
                Ver as últimas notícias
              </Link>
              <Link to="/busca" className="btn btn--secundario">
                Buscar
              </Link>
            </>
          }
        >
          Ela pode ter saído do feed da fonte. O Tech News mostra apenas as notícias mais recentes
          de cada portal.
        </EstadoVazio>
      </div>
    )
  }
  return <NoticiaConteudo noticia={noticia} todas={dados.noticias} />
}

function NoticiaConteudo({ noticia, todas }) {
  const extras = useMemo(() => {
    const outrasFontes = mesmoAssunto(noticia, todas)
    const ignorar = outrasFontes.map((n) => n.id)
    return {
      termos: termosNoTexto(`${noticia.titulo} ${noticia.resumo}`),
      outrasFontes,
      relacionadas: relacionadas(noticia, todas, ignorar),
      daFonte: todas
        .filter((n) => n.fonteSlug === noticia.fonteSlug && n.id !== noticia.id)
        .slice(0, 3),
    }
  }, [noticia, todas])

  const editoria = nomeEditoria(noticia.editoria)

  return (
    <>
      <div className="container">
        <Trilha
          itens={[
            { rotulo: editoria, para: `/editoria/${noticia.editoria}` },
            { rotulo: encurtar(noticia.titulo, 5) },
          ]}
        />

        <header className="noticia-topo">
          <Badge>{editoria}</Badge>
          <h1>{noticia.titulo}</h1>
        </header>

        <div className="noticia-barra">
          <div className="noticia-barra__fonte">
            <Sigla fonteSlug={noticia.fonteSlug} tamanho={46} />
            <div>
              <Link to={`/fontes/${noticia.fonteSlug}`} className="noticia-barra__nome">
                {noticia.fonte}
              </Link>
              <p className="data">
                Publicado em <time dateTime={noticia.data}>{dataCompleta(noticia.data)}</time> ·{' '}
                {tempoRelativo(noticia.data)}
              </p>
            </div>
          </div>
          <div className="noticia-barra__acoes">
            <LinkExterno href={noticia.link} className="btn btn--primario">
              Ler no {noticia.fonte}
              <ArrowUpRight size={16} aria-hidden="true" />
            </LinkExterno>
          </div>
        </div>

        <div className="com-lateral">
          <article className="noticia-corpo">
            {noticia.imagem && (
              <figure className="noticia-figura">
                <Imagem
                  src={noticia.imagem}
                  prioridade
                  alt={`Imagem da notícia, enviada pelo feed do ${noticia.fonte}`}
                />
                <figcaption className="data">Imagem: {noticia.fonte}</figcaption>
              </figure>
            )}

            <h2 className="rotulo">Resumo da fonte</h2>
            <p className="noticia-resumo">
              {noticia.resumo ||
                'A fonte não enviou um resumo para esta notícia. Leia a matéria completa no site original.'}
            </p>

            {}
            <div className="ler-completa">
              <div className="ler-completa__fonte">
                <Sigla fonteSlug={noticia.fonteSlug} tamanho={52} />
                <div>
                  <p className="ler-completa__titulo">Continue lendo no {noticia.fonte}</p>
                  <p className="data ler-completa__url">{enderecoCurto(noticia.link)}</p>
                </div>
              </div>
              <LinkExterno href={noticia.link} className="btn btn--primario btn--grande">
                Ler matéria completa
                <ArrowUpRight size={16} aria-hidden="true" />
              </LinkExterno>
            </div>
            <p className="aviso-direitos">
              <Info size={16} aria-hidden="true" />O Tech News mostra apenas o título, o resumo e a
              imagem enviados pelo feed da fonte. O texto completo pertence ao {noticia.fonte}.
            </p>

            {extras.termos.length > 0 && (
              <section aria-labelledby="termos-titulo" className="termos-noticia">
                <div className="bloco__topo">
                  <h2 id="termos-titulo">
                    <BookOpen size={18} aria-hidden="true" />
                    Termos desta notícia
                  </h2>
                  <Link to="/glossario" className="link-seta link-seta--suave">
                    Glossário completo
                  </Link>
                </div>
                <dl>
                  {extras.termos.map((t) => (
                    <div key={t.termo} className="termos-noticia__item">
                      <dt>{t.termo}</dt>
                      <dd>{t.definicao}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section aria-labelledby="outras-fontes-titulo" className="outras-fontes">
              <h2 id="outras-fontes-titulo">O mesmo assunto em outras fontes</h2>
              {extras.outrasFontes.length > 0 ? (
                <>
                  <p>Compare como cada portal cobriu a notícia.</p>
                  <ul>
                    {extras.outrasFontes.map((n) => (
                      <li key={n.id}>
                        <Link to={`/noticia/${n.id}`} className="outras-fontes__item lnk">
                          <Sigla fonteSlug={n.fonteSlug} tamanho={36} />
                          <span className="mini__texto">
                            <span className="data">
                              {n.fonte} · {tempoRelativo(n.data)}
                            </span>
                            <span className="card__titulo">{n.titulo}</span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Nenhuma outra fonte publicou sobre este assunto por enquanto.</p>
              )}
            </section>
          </article>

          <aside className="lateral" aria-label="Conteúdo complementar">
            <BlocoEmAlta />
            {extras.daFonte.length > 0 && (
              <section aria-labelledby="mais-da-fonte">
                <div className="bloco__topo">
                  <h2 id="mais-da-fonte">Mais do {noticia.fonte}</h2>
                  <Link to={`/fontes/${noticia.fonteSlug}`} className="link-seta link-seta--suave">
                    Ver fonte <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
                <ul className="lista-linhas">
                  {extras.daFonte.map((n) => (
                    <li key={n.id}>
                      <MiniNoticia noticia={n} pequena />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </div>

      {extras.relacionadas.length > 0 && (
        <section aria-labelledby="relacionadas-titulo" className="container secao">
          <CabecalhoSecao id="relacionadas-titulo" titulo="Relacionadas">
            <Link to={`/editoria/${noticia.editoria}`} className="link-seta link-seta--suave">
              Mais em {editoria} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </CabecalhoSecao>
          <div className="grade grade--3">
            {extras.relacionadas.map((n) => (
              <CardNoticia key={n.id} noticia={n} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}
