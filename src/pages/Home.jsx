import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { EDITORIAS, nomeEditoria } from '../../config/editorias'
import { FONTES, FONTES_RSS } from '../../config/fontes'
import {
  AtualizadoHa,
  Badge,
  BadgeTipo,
  CabecalhoSecao,
  LinkExterno,
  Sigla,
} from '../components/ui/Basicos'
import { LogoFerramenta } from '../components/ui/LogoFerramenta'
import { BlocoEmAlta, CartaoFontes, CartaoTermoDoDia } from '../components/ui/Blocos'
import { CardNoticia, CardNoticiaHorizontal, MiniNoticia } from '../components/ui/Cards'
import {
  AvisoFontes,
  Carregando,
  Esqueleto,
  EsqueletoCard,
  EstadoErro,
  EstadoVazio,
} from '../components/ui/Estados'
import { Imagem } from '../components/ui/Imagem'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { assuntosDoDia, destaques, resumoDoDia, tendencias } from '../lib/analise'
import { useNoticias, useReleases } from '../lib/api'
import { tempoRelativo } from '../lib/tempo'
import { CarregarMais } from '../components/ui/CarregarMais'

const POR_PAGINA_DESTAQUES = 3
const RECENTES_POR_VEZ = 6

export function Home() {
  useTituloPagina()
  const { dados, erro, recarregar } = useNoticias()

  if (erro) {
    return (
      <div className="container espaco-topo">
        <EstadoErro aoTentarDeNovo={recarregar} />
      </div>
    )
  }
  if (!dados) return <HomeCarregando />

  if (dados.noticias.length === 0) {
    return (
      <div className="container espaco-topo">
        <EstadoVazio
          titulo="Nenhuma notícia no momento"
          acoes={
            <button type="button" className="btn btn--primario" onClick={recarregar}>
              Tentar novamente
            </button>
          }
        >
          Não conseguimos ler os feeds agora. Verifique sua conexão e tente de novo em alguns
          instantes.
        </EstadoVazio>
      </div>
    )
  }
  return (
    <HomeConteudo
      noticias={dados.noticias}
      atualizadoEm={dados.atualizadoEm}
      fontes={dados.fontes}
    />
  )
}

function HomeConteudo({ noticias, atualizadoEm, fontes }) {
  const analise = useMemo(() => {
    const resumo = resumoDoDia(noticias)

    const principal =
      resumo.find((r) => r.noticia.imagem)?.noticia ?? noticias.find((n) => n.imagem) ?? noticias[0]
    const ultimas = noticias.filter((n) => n.id !== principal.id).slice(0, 5)
    const listaDestaques = destaques(noticias, [principal, ...ultimas])

    const jaUsadas = [principal, ...ultimas, ...listaDestaques].map((n) => n.id)
    return {
      principal,
      ultimas,
      resumo,
      destaques: listaDestaques,
      recentes: noticias.filter((n) => !jaUsadas.includes(n.id)),
      assuntos: assuntosDoDia(noticias),
      tendencias: tendencias(noticias),
    }
  }, [noticias])

  const [paginaDestaques, setPaginaDestaques] = useState(0)
  const [recentesVisiveis, setRecentesVisiveis] = useState(RECENTES_POR_VEZ)

  const totalPaginas = Math.max(1, Math.ceil(analise.destaques.length / POR_PAGINA_DESTAQUES))
  const destaquesDaVez = analise.destaques.slice(
    paginaDestaques * POR_PAGINA_DESTAQUES,
    (paginaDestaques + 1) * POR_PAGINA_DESTAQUES,
  )

  return (
    <>
      <div className="container">
        <AvisoFontes fontes={fontes} />

        {}
        <div className="home-topo">
          <Destaque noticia={analise.principal} />

          <section aria-labelledby="ultimas-titulo" className="home-ultimas">
            <div className="bloco__topo">
              <h2 id="ultimas-titulo">Últimas</h2>
              <Link to="/busca" className="link-seta link-seta--suave">
                Ver todas <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <AtualizadoHa quando={atualizadoEm} classe="status--ok" />
            <ul className="lista-linhas" style={{ marginTop: 10 }}>
              {analise.ultimas.map((n) => (
                <li key={n.id}>
                  <MiniNoticia noticia={n} />
                </li>
              ))}
            </ul>
          </section>
        </div>

        {}
        {analise.assuntos.length > 0 && (
          <nav aria-label="Assuntos do dia" className="rolavel assuntos-dia">
            <span className="assuntos-dia__rotulo">
              <Zap size={16} aria-hidden="true" />
              Assuntos do dia
            </span>
            {analise.assuntos.map((a) => (
              <Link key={a} to={`/busca?q=${encodeURIComponent(a)}`} className="chip">
                #{a}
              </Link>
            ))}
          </nav>
        )}

        {}
        <section aria-labelledby="resumo-titulo" className="resumo-dia">
          <div className="resumo-dia__intro">
            <span className="resumo-dia__rotulo">
              <Sparkles size={15} aria-hidden="true" />
              RESUMO DO DIA
            </span>
            <h2 id="resumo-titulo">{analise.resumo.length} coisas para saber hoje, em 1 minuto.</h2>
            <p>
              As notícias mais relevantes, escolhidas automaticamente pelo número de portais que
              falaram sobre o assunto.
            </p>
          </div>
          <ol className="resumo-dia__lista">
            {analise.resumo.map(({ noticia, fontes }, i) => (
              <li key={noticia.id}>
                <Link to={`/noticia/${noticia.id}`} className="resumo-dia__item lnk">
                  <span className="resumo-dia__numero" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mini__texto">
                    <span className="card__titulo">{noticia.titulo}</span>
                    <span className="data">
                      {noticia.fonte} · {tempoRelativo(noticia.data)}
                      {fontes > 1 && ` · em ${fontes} fontes`}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {}
      {analise.destaques.length > 0 && (
        <section aria-labelledby="destaques-titulo" className="container secao">
          <CabecalhoSecao
            id="destaques-titulo"
            titulo="Destaques"
            descricao="As notícias mais relevantes do dia, de várias fontes."
          >
            {totalPaginas > 1 && (
              <div className="secao__acoes">
                <button
                  type="button"
                  className="btn btn--secundario btn--icone"
                  aria-label="Destaques anteriores"
                  disabled={paginaDestaques === 0}
                  onClick={() => setPaginaDestaques((p) => p - 1)}
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="btn btn--secundario btn--icone"
                  aria-label="Próximos destaques"
                  disabled={paginaDestaques >= totalPaginas - 1}
                  onClick={() => setPaginaDestaques((p) => p + 1)}
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>
            )}
          </CabecalhoSecao>
          <div className="grade grade--destaques" aria-live="polite">
            {destaquesDaVez.map((n) => (
              <CardNoticia key={n.id} noticia={n} grande />
            ))}
          </div>
        </section>
      )}

      {}
      <div className="container secao com-lateral">
        <section aria-labelledby="recentes-titulo">
          <CabecalhoSecao
            id="recentes-titulo"
            titulo="Recentes"
            descricao="Tudo o que as fontes publicaram, em ordem cronológica."
          />
          <div className="lista-cards" id="lista-recentes">
            {analise.recentes.slice(0, recentesVisiveis).map((n) => (
              <CardNoticiaHorizontal key={n.id} noticia={n} />
            ))}
          </div>
          <CarregarMais
            visiveis={recentesVisiveis}
            total={analise.recentes.length}
            passo={RECENTES_POR_VEZ}
            aoMudar={setRecentesVisiveis}
            idLista="lista-recentes"
          />
        </section>

        <aside className="lateral" aria-label="Conteúdo complementar">
          <BlocoEmAlta />
          <CartaoTermoDoDia />
          <section aria-labelledby="editorias-lateral">
            <div className="bloco__topo">
              <h2 id="editorias-lateral">Editorias</h2>
            </div>
            <div className="chips" style={{ marginTop: 12 }}>
              {EDITORIAS.map((e) => (
                <Link key={e.slug} to={`/editoria/${e.slug}`} className="chip">
                  {e.nome}
                </Link>
              ))}
            </div>
          </section>
          <CartaoFontes />
        </aside>
      </div>

      <ReleasesDaSemana />

      {}
      <section aria-labelledby="explore-titulo" className="container secao">
        <CabecalhoSecao id="explore-titulo" titulo="Explore por editoria" />
        <ul className="grade grade--editorias">
          {EDITORIAS.map((e, i) => (
            <li key={e.slug} className="card card-editoria">
              <span className="data">{String(i + 1).padStart(2, '0')}</span>
              <span className="card-editoria__texto">
                <Link to={`/editoria/${e.slug}`} className="card__link card__titulo">
                  {e.nome}
                </Link>
                <span>{e.descricao}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {}
      {analise.tendencias.length > 0 && (
        <section aria-labelledby="tendencias-titulo" className="container secao">
          <CabecalhoSecao
            id="tendencias-titulo"
            titulo="Tendências"
            descricao="As editorias que mais apareceram nas fontes nos últimos sete dias."
          />
          <div className="grade grade--4">
            {analise.tendencias.map((t, i) => (
              <article key={t.editoria.slug} className="tendencia">
                <div className="tendencia__topo">
                  <span className="data" style={{ color: 'var(--destaque)' }}>
                    TENDÊNCIA {String(i + 1).padStart(2, '0')}
                  </span>
                  <TrendingUp size={18} aria-hidden="true" color="var(--destaque)" />
                </div>
                <h3>
                  <Link to={`/editoria/${t.editoria.slug}`}>{t.editoria.nome}</Link>
                </h3>
                <p className="data">{t.noticias.length} notícias na semana</p>
                {t.noticias.slice(0, 2).map((n) => (
                  <Link key={n.id} to={`/noticia/${n.id}`} className="tendencia__link lnk">
                    <span className="card__titulo">{n.titulo}</span>
                  </Link>
                ))}
              </article>
            ))}
          </div>
        </section>
      )}

      {}
      <div className="container secao">
        <section aria-labelledby="nossas-fontes-titulo" className="nossas-fontes">
          <div className="nossas-fontes__texto">
            <span className="rotulo">Nossas fontes</span>
            <h2 id="nossas-fontes-titulo">Notícias de vários portais, num só lugar.</h2>
            <p>
              O Tech News lê os feeds dos sites de tecnologia a cada 30 minutos e leva você direto
              para a matéria original.
            </p>
            <div>
              <Link to="/fontes" className="btn btn--secundario">
                Ver todas as fontes <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
          <ul className="nossas-fontes__lista">
            {FONTES.map((f) => (
              <li key={f.slug}>
                <Link to={f.feed ? `/fontes/${f.slug}` : '/em-alta'} className="chip chip-fonte">
                  <Sigla fonteSlug={f.slug} tamanho={28} />
                  {f.nome}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}

function Destaque({ noticia }) {
  return (
    <article className="hero">
      <Imagem src={noticia.imagem} prioridade className="hero__imagem" />
      <div className="hero__conteudo">
        <div className="hero__badges">
          <Badge claro>Destaque</Badge>
          <Badge claro>{nomeEditoria(noticia.editoria)}</Badge>
        </div>
        <h1 className="hero__titulo">
          <Link to={`/noticia/${noticia.id}`} className="card__link">
            {noticia.titulo}
          </Link>
        </h1>
        {noticia.resumo && <p className="hero__resumo">{noticia.resumo}</p>}
        <div className="hero__rodape">
          <div className="hero__meta">
            <Sigla fonteSlug={noticia.fonteSlug} tamanho={28} />
            <strong>{noticia.fonte}</strong>
            <time className="data" dateTime={noticia.data}>
              · {tempoRelativo(noticia.data)}
            </time>
          </div>
          <span className="hero__seta" aria-hidden="true">
            <ArrowUpRight size={20} />
          </span>
        </div>
      </div>
    </article>
  )
}

function ReleasesDaSemana() {
  const { dados, erro } = useReleases()
  if (erro || (dados && dados.releases.length === 0)) return null
  return (
    <section aria-labelledby="releases-titulo" className="container secao">
      <CabecalhoSecao
        id="releases-titulo"
        titulo="Releases da semana"
        descricao="Novas versões das ferramentas que devs mais usam, direto do GitHub."
      >
        <Link to="/releases" className="link-seta link-seta--suave">
          Ver todas <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </CabecalhoSecao>
      <div className="grade grade--4">
        {dados
          ? dados.releases.slice(0, 4).map((r) => (
              <LinkExterno key={r.slug} href={r.link} className="card card-release lnk">
                <span className="card-release__topo">
                  <LogoFerramenta slug={r.slug} sigla={r.sigla} cor={r.cor} />
                  <BadgeTipo tipo={r.tipo} />
                </span>
                <span>
                  <span className="card__titulo card-release__nome">{r.nome}</span>
                  <span className="card-release__versao">v{r.versao}</span>
                </span>
                <span className="data">
                  {r.area} · {tempoRelativo(r.data)}
                </span>
              </LinkExterno>
            ))
          : Array.from({ length: 4 }, (_, i) => <Esqueleto key={i} altura={150} raio={18} />)}
      </div>
    </section>
  )
}

function HomeCarregando() {
  return (
    <div className="container">
      <p className="data carregando-texto">Buscando notícias de {FONTES_RSS.length} portais…</p>
      <Carregando>
        <div className="home-topo">
          <Esqueleto altura={420} raio={22} />
          <div style={{ display: 'grid', gap: 18, alignContent: 'start' }}>
            {Array.from({ length: 5 }, (_, i) => (
              <Esqueleto key={i} altura={76} raio={10} />
            ))}
          </div>
        </div>
        <div className="grade grade--destaques secao">
          {Array.from({ length: 3 }, (_, i) => (
            <EsqueletoCard key={i} />
          ))}
        </div>
      </Carregando>
    </div>
  )
}
