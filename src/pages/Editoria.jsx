import { ArrowRight, ChevronDown } from 'lucide-react'
import { useMemo } from 'react'
import { Link, NavLink, useParams, useSearchParams } from 'react-router'
import { EDITORIAS, buscarEditoria } from '../../config/editorias'
import { FONTES, NOME_IDIOMA } from '../../config/fontes'
import { Badge, CabecalhoPagina, Sigla, Trilha } from '../components/ui/Basicos'
import { CartaoFontes } from '../components/ui/Blocos'
import { CardNoticia, ItemRanking, MetaFonte } from '../components/ui/Cards'
import {
  AvisoFontes,
  Carregando,
  EsqueletoCard,
  EstadoErro,
  EstadoVazio,
} from '../components/ui/Estados'
import { Imagem } from '../components/ui/Imagem'
import { Paginacao } from '../components/ui/Paginacao'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { trocarParametro } from '../lib/url'
import { agruparAssuntos, porRelevancia } from '../lib/analise'
import { useNoticias } from '../lib/api'
import { NaoEncontrada } from './NaoEncontrada'

const POR_PAGINA = 12

const IDIOMAS = [
  { valor: '', rotulo: 'Todas' },
  { valor: 'pt', rotulo: 'Em português' },
  { valor: 'en', rotulo: 'Em inglês' },
]

const ORDENS = [
  { valor: 'recentes', rotulo: 'Mais recentes' },
  { valor: 'antigas', rotulo: 'Mais antigas' },
  { valor: 'fonte', rotulo: 'Por fonte' },
]

function ordenar(noticias, ordem) {
  const lista = [...noticias]
  if (ordem === 'antigas') return lista.reverse()
  if (ordem === 'fonte')
    return lista.sort((a, b) => a.fonte.localeCompare(b.fonte) || b.data.localeCompare(a.data))
  return lista
}

export function Editoria() {
  const { slug } = useParams()
  const editoria = buscarEditoria(slug)
  useTituloPagina(editoria?.nome)

  const [params, setParams] = useSearchParams()
  const idioma = params.get('idioma') ?? ''
  const ordem = params.get('ordem') ?? 'recentes'
  const pagina = Math.max(1, Number(params.get('pagina')) || 1)

  const { dados, erro, recarregar } = useNoticias()

  const daEditoria = useMemo(
    () => dados?.noticias.filter((n) => n.editoria === editoria?.slug) ?? [],
    [dados, editoria],
  )

  if (!editoria) return <NaoEncontrada />

  function mudar(chave, valor) {
    const novos = trocarParametro(params, chave, valor)
    if (chave !== 'pagina') novos.delete('pagina')
    setParams(novos, { preventScrollReset: chave !== 'pagina' })
  }

  const destaque = daEditoria.find((n) => n.imagem) ?? daEditoria[0]
  const filtradas = ordenar(
    daEditoria.filter((n) => n.id !== destaque?.id && (!idioma || n.idioma === idioma)),
    ordem,
  )
  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / POR_PAGINA))
  const daPagina = filtradas.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA)

  const emAlta = porRelevancia(agruparAssuntos(daEditoria))
    .slice(0, 4)
    .map((grupo) => grupo[0])
  const fontesDaEditoria = FONTES.map((f) => ({
    fonte: f,
    total: daEditoria.filter((n) => n.fonteSlug === f.slug).length,
  }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)

  return (
    <div className="container">
      <Trilha itens={[{ rotulo: editoria.nome }]} />
      <CabecalhoPagina rotulo="Editoria" titulo={editoria.nome}>
        {editoria.descricaoLonga}
      </CabecalhoPagina>

      {}
      <nav aria-label="Editorias" className="rolavel abas-editorias">
        {EDITORIAS.map((e) => (
          <NavLink key={e.slug} to={`/editoria/${e.slug}`} className="chip">
            {e.nome}
          </NavLink>
        ))}
      </nav>

      {erro && <EstadoErro aoTentarDeNovo={recarregar} />}
      {!dados && !erro && (
        <Carregando>
          <div className="grade grade--2">
            {Array.from({ length: 4 }, (_, i) => (
              <EsqueletoCard key={i} />
            ))}
          </div>
        </Carregando>
      )}

      {dados && (
        <>
          <AvisoFontes fontes={dados.fontes} />

          {!destaque ? (
            <EstadoVazio
              titulo="Nada por aqui ainda"
              acoes={
                <Link to="/" className="btn btn--secundario">
                  Ver todas
                </Link>
              }
            >
              Ainda não há notícias nesta editoria. Volte em alguns minutos.
            </EstadoVazio>
          ) : (
            <>
              <article className="card destaque-editoria">
                <Imagem src={destaque.imagem} prioridade />
                <div className="destaque-editoria__texto">
                  <Badge>Em destaque</Badge>
                  <h2 className="card__titulo">
                    <Link to={`/noticia/${destaque.id}`} className="card__link">
                      {destaque.titulo}
                    </Link>
                  </h2>
                  {destaque.resumo && <p>{destaque.resumo}</p>}
                  <MetaFonte noticia={destaque} />
                  <div>
                    <span className="btn btn--primario" aria-hidden="true">
                      Ver resumo <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </article>

              {}
              <div className="barra-filtros">
                <div role="group" aria-label="Filtrar por idioma" className="chips">
                  {IDIOMAS.map((i) => (
                    <button
                      key={i.valor}
                      type="button"
                      className="chip"
                      aria-pressed={idioma === i.valor}
                      onClick={() => mudar('idioma', i.valor)}
                    >
                      {i.rotulo}
                    </button>
                  ))}
                </div>
                <div className="barra-filtros__ordem">
                  <label htmlFor="ordem">Ordenar por</label>
                  <span className="select">
                    <select
                      id="ordem"
                      value={ordem}
                      onChange={(e) => mudar('ordem', e.target.value)}
                    >
                      {ORDENS.map((o) => (
                        <option key={o.valor} value={o.valor}>
                          {o.rotulo}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} aria-hidden="true" />
                  </span>
                </div>
              </div>

              <div className="com-lateral">
                <section aria-label="Lista de notícias">
                  <p className="data" style={{ marginBottom: 16 }} aria-live="polite">
                    {filtradas.length} {filtradas.length === 1 ? 'notícia' : 'notícias'}
                    {totalPaginas > 1 && ` · página ${pagina} de ${totalPaginas}`}
                  </p>
                  {daPagina.length === 0 ? (
                    <EstadoVazio titulo="Nenhuma notícia com esse filtro">
                      Tente outro idioma ou volte para “Todas”.
                    </EstadoVazio>
                  ) : (
                    <div className="grade grade--2">
                      {daPagina.map((n) => (
                        <CardNoticia key={n.id} noticia={n} />
                      ))}
                    </div>
                  )}
                  <Paginacao
                    atual={Math.min(pagina, totalPaginas)}
                    total={totalPaginas}
                    aoMudar={(p) => mudar('pagina', p === 1 ? '' : String(p))}
                  />
                </section>

                <aside className="lateral" aria-label="Conteúdo complementar">
                  <section aria-labelledby="em-alta-editoria">
                    <div className="bloco__topo">
                      <h2 id="em-alta-editoria">Em alta em {editoria.nome}</h2>
                    </div>
                    <ol className="lista-linhas">
                      {emAlta.map((n, i) => (
                        <li key={n.id}>
                          <ItemRanking
                            posicao={i + 1}
                            titulo={n.titulo}
                            meta={`${n.fonte} · ${editoria.nome}`}
                            para={`/noticia/${n.id}`}
                          />
                        </li>
                      ))}
                    </ol>
                  </section>

                  <section aria-labelledby="fontes-editoria">
                    <div className="bloco__topo">
                      <h2 id="fontes-editoria">Fontes desta editoria</h2>
                      <Link to="/fontes" className="link-seta link-seta--suave">
                        Todas <ArrowRight size={14} aria-hidden="true" />
                      </Link>
                    </div>
                    <ul className="lista-fontes">
                      {fontesDaEditoria.map(({ fonte, total }) => (
                        <li key={fonte.slug}>
                          <Link to={`/fontes/${fonte.slug}`} className="lista-fontes__item lnk">
                            <Sigla fonteSlug={fonte.slug} tamanho={42} />
                            <span>
                              <span className="card__titulo">{fonte.nome}</span>
                              <span className="lista-fontes__meta">
                                {NOME_IDIOMA[fonte.idioma]} · {total}{' '}
                                {total === 1 ? 'notícia' : 'notícias'}
                              </span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <CartaoFontes />
                </aside>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
