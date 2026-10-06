import { ArrowUpRight, Copy } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router'
import { EDITORIAS } from '../../config/editorias'
import { NOME_IDIOMA, buscarFonte } from '../../config/fontes'
import { LinkExterno, Sigla, Trilha } from '../components/ui/Basicos'
import { CardNoticia } from '../components/ui/Cards'
import { Carregando, EsqueletoCard, EstadoErro, EstadoVazio } from '../components/ui/Estados'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { contarPorEditoria } from '../lib/analise'
import { useNoticias } from '../lib/api'
import { tempoRelativo } from '../lib/tempo'
import { NaoEncontrada } from './NaoEncontrada'
import { CarregarMais } from '../components/ui/CarregarMais'

const POR_VEZ = 9

export function Fonte() {
  const { slug } = useParams()
  const fonte = buscarFonte(slug)
  useTituloPagina(fonte?.nome)
  const [params, setParams] = useSearchParams()
  const editoria = params.get('editoria') ?? ''
  const [visiveis, setVisiveis] = useState(POR_VEZ)
  const { dados, erro, recarregar } = useNoticias()
  const [copiado, setCopiado] = useState(false)

  if (!fonte) return <NaoEncontrada />
  if (!fonte.feed) return <Navigate to="/em-alta" replace />

  const daFonte = dados?.noticias.filter((n) => n.fonteSlug === fonte.slug) ?? []
  const status = dados?.fontes.find((f) => f.slug === fonte.slug)
  const contagem = contarPorEditoria(daFonte)
  const editoriasDaFonte = EDITORIAS.filter((e) => contagem[e.slug])
  const lista = daFonte.filter((n) => !editoria || n.editoria === editoria)

  return (
    <div className="container">
      <Trilha itens={[{ rotulo: 'Fontes', para: '/fontes' }, { rotulo: fonte.nome }]} />

      <section className="fonte-topo" aria-labelledby="fonte-nome">
        <Sigla fonteSlug={fonte.slug} tamanho={112} />
        <div className="fonte-topo__texto">
          <span className="pagina-topo__rotulo">
            FONTE · {NOME_IDIOMA[fonte.idioma].toUpperCase()}
          </span>
          <h1 id="fonte-nome">{fonte.nome}</h1>
          <p>{fonte.descricao}</p>
          <ul className="fonte-topo__status">
            <li className="status">
              <span
                className={`ponto ${status && !status.ok ? 'ponto--erro' : !status ? 'ponto--alerta' : ''}`}
                aria-hidden="true"
              />
              {!status
                ? 'Verificando feed…'
                : status.ok
                  ? 'Feed ativo'
                  : `Feed indisponível (${status.erro})`}
            </li>
            {dados && <li className="data">Última leitura {tempoRelativo(dados.atualizadoEm)}</li>}
            <li className="data">Verificado a cada 30 min</li>
          </ul>
          <div className="fonte-topo__acoes">
            <LinkExterno href={fonte.site} className="btn btn--primario">
              Visitar site <ArrowUpRight size={16} aria-hidden="true" />
            </LinkExterno>
            <button
              type="button"
              className="btn btn--secundario"
              onClick={() => {
                navigator.clipboard.writeText(fonte.feed)
                setCopiado(true)
              }}
            >
              <Copy size={16} aria-hidden="true" />
              {copiado ? 'Copiado!' : 'Copiar feed RSS'}
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="ultimas-da-fonte" className="secao secao--perto">
        <div className="secao__topo">
          <h2 id="ultimas-da-fonte">Últimas do {fonte.nome}</h2>
        </div>

        {editoriasDaFonte.length > 1 && (
          <div
            role="group"
            aria-label="Filtrar por editoria"
            className="rolavel"
            style={{ marginBottom: 24 }}
          >
            {[{ slug: '', nome: 'Todas' }, ...editoriasDaFonte].map((e) => (
              <button
                key={e.slug}
                type="button"
                className="chip"
                aria-pressed={editoria === e.slug}
                onClick={() => {
                  setVisiveis(POR_VEZ)
                  setParams(e.slug ? { editoria: e.slug } : {}, { preventScrollReset: true })
                }}
              >
                {e.nome}
              </button>
            ))}
          </div>
        )}

        {erro && <EstadoErro aoTentarDeNovo={recarregar} />}
        {!dados && !erro && (
          <Carregando>
            <div className="grade grade--3">
              {Array.from({ length: 3 }, (_, i) => (
                <EsqueletoCard key={i} />
              ))}
            </div>
          </Carregando>
        )}
        {dados && lista.length === 0 && (
          <EstadoVazio titulo="Nenhuma notícia por enquanto">
            {status?.ok === false
              ? 'Não conseguimos ler o feed desta fonte agora. Nova tentativa em 30 minutos.'
              : 'Esta fonte ainda não publicou nada nesta editoria.'}
          </EstadoVazio>
        )}

        <div className="grade grade--3" id="lista-fonte">
          {lista.slice(0, visiveis).map((n) => (
            <CardNoticia key={n.id} noticia={n} />
          ))}
        </div>
        <CarregarMais
          visiveis={visiveis}
          total={lista.length}
          passo={POR_VEZ}
          aoMudar={setVisiveis}
          idLista="lista-fonte"
        />
      </section>
    </div>
  )
}
