import { ChevronDown, Search, SearchX } from 'lucide-react'
import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { EDITORIAS } from '../../config/editorias'
import { FONTES_RSS } from '../../config/fontes'
import { MetaFonte } from '../components/ui/Cards'
import { Carregando, EsqueletoLinha, EstadoErro, EstadoVazio } from '../components/ui/Estados'
import { Imagem } from '../components/ui/Imagem'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { trocarParametro } from '../lib/url'
import { assuntosDoDia } from '../lib/analise'
import { useNoticias } from '../lib/api'
import { comecaPalavra, destacar, normalizar, palavrasDaBusca } from '../lib/texto'
import { CarregarMais } from '../components/ui/CarregarMais'

const UMA_HORA = 60 * 60 * 1000

function pontuar(noticia, palavras) {
  const titulo = normalizar(noticia.titulo)
  const resumo = normalizar(noticia.resumo)
  let pontos = 0
  for (const palavra of palavras) {
    const noTitulo = comecaPalavra(titulo, palavra)
    const noResumo = comecaPalavra(resumo, palavra)
    if (!noTitulo && !noResumo) return 0
    if (noTitulo) pontos += 2
    if (noResumo) pontos += 1
  }
  return pontos
}

function dentroDoPeriodo(noticia, periodo) {
  if (!periodo) return true
  const horas = periodo === '24h' ? 24 : 24 * 7
  return Date.now() - new Date(noticia.data).getTime() <= horas * UMA_HORA
}

export function Busca() {
  const [params, setParams] = useSearchParams()
  const consulta = params.get('q') ?? ''
  const editoria = params.get('editoria') ?? ''
  const fonte = params.get('fonte') ?? ''
  const periodo = params.get('periodo') ?? ''
  const ordem = params.get('ordem') ?? 'relevancia'

  useTituloPagina(consulta ? `Busca: ${consulta}` : 'Busca')
  const { dados, erro, recarregar } = useNoticias()

  function mudar(chave, valor) {
    setParams(trocarParametro(params, chave, valor))
  }

  function enviar(evento) {
    evento.preventDefault()
    const texto = String(new FormData(evento.target).get('q')).trim()
    mudar('q', texto)
  }

  const palavras = palavrasDaBusca(consulta)
  let resultados = []
  if (dados && palavras.length > 0) {
    resultados = dados.noticias
      .map((n) => ({ noticia: n, pontos: pontuar(n, palavras) }))
      .filter((r) => r.pontos > 0)

      .filter((r) => !editoria || r.noticia.editoria === editoria)
      .filter((r) => !fonte || r.noticia.fonteSlug === fonte)
      .filter((r) => dentroDoPeriodo(r.noticia, periodo))

    if (ordem === 'recentes')
      resultados.sort((a, b) => b.noticia.data.localeCompare(a.noticia.data))
    else resultados.sort((a, b) => b.pontos - a.pontos)
  }

  const sugestoes = dados ? assuntosDoDia(dados.noticias, 4) : []

  return (
    <div className="container busca">
      <h1 className="visualmente-oculto">Buscar notícias</h1>

      {}
      <form role="search" className="busca__form" onSubmit={enviar} key={consulta}>
        <div className="campo campo--grande">
          <label htmlFor="q" className="visualmente-oculto">
            Buscar notícias
          </label>
          <span className="campo__icone" aria-hidden="true">
            <Search size={20} />
          </span>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={consulta}
            placeholder="Buscar por assunto, empresa ou tecnologia"
            autoComplete="off"
          />
        </div>
        <button type="submit" className="btn btn--primario busca__botao">
          Buscar
        </button>
      </form>

      {erro && <EstadoErro aoTentarDeNovo={recarregar} />}

      {}
      {!consulta && dados && (
        <div className="busca__inicio">
          <p>Busque nas {dados.total} notícias das últimas horas. Algumas sugestões:</p>
          <div className="chips">
            {sugestoes.map((s) => (
              <Link key={s} to={`/busca?q=${encodeURIComponent(s)}`} className="chip">
                {s}
              </Link>
            ))}
          </div>
        </div>
      )}

      {consulta && !erro && (
        <>
          <div className="busca__resumo">
            <p aria-live="polite">
              {dados ? (
                <>
                  <strong>{resultados.length}</strong>{' '}
                  {resultados.length === 1 ? 'resultado' : 'resultados'} para “{consulta}”
                </>
              ) : (
                'Buscando…'
              )}
            </p>
            <div role="group" aria-label="Ordenar resultados" className="segmentado">
              <button
                type="button"
                aria-pressed={ordem === 'relevancia'}
                onClick={() => mudar('ordem', '')}
              >
                Relevância
              </button>
              <button
                type="button"
                aria-pressed={ordem === 'recentes'}
                onClick={() => mudar('ordem', 'recentes')}
              >
                Mais recentes
              </button>
            </div>
          </div>

          {}
          <div className="rolavel busca__filtros">
            <Filtro
              id="filtro-editoria"
              rotulo="Editoria"
              valor={editoria}
              aoMudar={(v) => mudar('editoria', v)}
            >
              <option value="">Todas as editorias</option>
              {EDITORIAS.map((e) => (
                <option key={e.slug} value={e.slug}>
                  {e.nome}
                </option>
              ))}
            </Filtro>
            <Filtro
              id="filtro-fonte"
              rotulo="Fonte"
              valor={fonte}
              aoMudar={(v) => mudar('fonte', v)}
            >
              <option value="">Todas as fontes</option>
              {FONTES_RSS.map((f) => (
                <option key={f.slug} value={f.slug}>
                  {f.nome}
                </option>
              ))}
            </Filtro>
            <Filtro
              id="filtro-periodo"
              rotulo="Período"
              valor={periodo}
              aoMudar={(v) => mudar('periodo', v)}
            >
              <option value="">Qualquer data</option>
              <option value="24h">Últimas 24 horas</option>
              <option value="7d">Última semana</option>
            </Filtro>
          </div>

          {!dados && (
            <Carregando rotulo="Carregando resultados">
              {[1, 2, 3, 4].map((i) => (
                <EsqueletoLinha key={i} />
              ))}
            </Carregando>
          )}

          {dados && resultados.length === 0 && (
            <EstadoVazio
              Icone={SearchX}
              titulo={`Nenhum resultado para “${consulta}”`}
              acoes={
                <Link to="/" className="btn btn--secundario">
                  Voltar para o início
                </Link>
              }
            >
              Verifique a ortografia, use termos mais gerais ou remova algum filtro.
            </EstadoVazio>
          )}

          {}
          {resultados.length > 0 && (
            <ListaResultados key={params.toString()} resultados={resultados} consulta={consulta} />
          )}
        </>
      )}
    </div>
  )
}

function Filtro({ id, rotulo, valor, aoMudar, children }) {
  return (
    <div className="busca__filtro">
      <label htmlFor={id}>{rotulo}</label>
      <span className="select">
        <select id={id} value={valor} onChange={(e) => aoMudar(e.target.value)}>
          {children}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </span>
    </div>
  )
}

function ListaResultados({ resultados, consulta }) {
  const [visiveis, setVisiveis] = useState(10)

  return (
    <section aria-label="Resultados" className="busca__resultados" id="lista-resultados">
      {resultados.slice(0, visiveis).map(({ noticia: n }) => (
        <article key={n.id} className="resultado">
          <Imagem src={n.imagem} />
          <div className="resultado__texto">
            <h2 className="card__titulo">
              <Link to={`/noticia/${n.id}`} className="card__link">
                {destacar(n.titulo, consulta)}
              </Link>
            </h2>
            {n.resumo && <p className="resumo">{destacar(n.resumo, consulta)}</p>}
            <MetaFonte noticia={n} tamanhoSigla={22} mostrarEditoria />
          </div>
        </article>
      ))}

      <CarregarMais
        visiveis={visiveis}
        total={resultados.length}
        passo={10}
        aoMudar={setVisiveis}
        idLista="lista-resultados"
        rotulo="Mostrar mais resultados"
      />
    </section>
  )
}
