import { ArrowUp, MessageSquare } from 'lucide-react'
import { useSearchParams } from 'react-router'
import {
  AtualizadoHa,
  CabecalhoPagina,
  CabecalhoSecao,
  LinkExterno,
  Sigla,
  Trilha,
} from '../components/ui/Basicos'
import {
  AvisoFontes,
  Carregando,
  Esqueleto,
  EstadoErro,
  EstadoVazio,
} from '../components/ui/Estados'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useEmAlta } from '../lib/api'
import { tempoRelativo } from '../lib/tempo'

function Numeros({ item }) {
  return (
    <span className="numeros">
      <span className="numeros__pontos">
        <ArrowUp size={14} aria-hidden="true" />
        {item.pontos} {item.fonte === 'TabNews' ? 'TabCoins' : 'pontos'}
      </span>
      <span>
        <MessageSquare size={14} aria-hidden="true" />
        {item.comentarios} comentários
      </span>
      <span>{tempoRelativo(item.data)}</span>
    </span>
  )
}

function FonteDoItem({ item, tamanho = 24 }) {
  return (
    <span className="meta-fonte">
      <Sigla fonteSlug={item.fonteSlug} tamanho={tamanho} />
      <strong className="meta-fonte__nome">{item.fonte}</strong>
      {item.dominio && <span className="data">{item.dominio}</span>}
    </span>
  )
}

function LinkItem({ item, children }) {
  return (
    <LinkExterno href={item.link} className="card__link">
      {children}
    </LinkExterno>
  )
}

export function EmAlta() {
  useTituloPagina('Em alta')
  const [params, setParams] = useSearchParams()
  const periodo = params.get('periodo') === 'semana' ? 'semana' : 'hoje'
  const { dados, erro, recarregar } = useEmAlta()
  const lista = dados?.[periodo] ?? []
  const [primeiro, segundo, terceiro] = lista

  return (
    <div className="container">
      <Trilha itens={[{ rotulo: 'Em alta' }]} />
      <div className="topo-com-acoes">
        <CabecalhoPagina titulo="Em alta">
          As discussões mais votadas nas comunidades de tecnologia, com base nos pontos do Hacker
          News e nas TabCoins do TabNews.
        </CabecalhoPagina>
        <div className="topo-com-acoes__lado">
          <div role="group" aria-label="Período" className="segmentado">
            <button
              type="button"
              aria-pressed={periodo === 'hoje'}
              onClick={() => setParams({}, { preventScrollReset: true })}
            >
              Hoje
            </button>
            <button
              type="button"
              aria-pressed={periodo === 'semana'}
              onClick={() => setParams({ periodo: 'semana' }, { preventScrollReset: true })}
            >
              Esta semana
            </button>
          </div>
          <AtualizadoHa quando={dados?.atualizadoEm} />
        </div>
      </div>

      {erro && <EstadoErro aoTentarDeNovo={recarregar} />}
      {!dados && !erro && (
        <Carregando rotulo="Carregando ranking">
          <div className="podio">
            <Esqueleto altura={420} raio={22} />
            <div style={{ display: 'grid', gap: 24 }}>
              <Esqueleto altura={200} raio={22} />
              <Esqueleto altura={200} raio={22} />
            </div>
          </div>
        </Carregando>
      )}

      {dados && (
        <>
          <AvisoFontes fontes={dados.fontes} />
          {lista.length === 0 && (
            <EstadoVazio titulo="Nada em alta agora">
              As comunidades não responderam. Tente de novo em alguns minutos.
            </EstadoVazio>
          )}

          {}
          {primeiro && (
            <ol className="podio">
              <li className="card podio__primeiro">
                <div className="podio__texto">
                  <div className="podio__posicao">
                    <span className="podio__numero">
                      <span className="visualmente-oculto">Posição </span>01
                    </span>
                    <FonteDoItem item={primeiro} />
                  </div>
                  <h2 className="card__titulo">
                    <LinkItem item={primeiro}>{primeiro.titulo}</LinkItem>
                  </h2>
                  <Numeros item={primeiro} />
                </div>
              </li>
              <li className="podio__menores">
                <ol>
                  {[segundo, terceiro].filter(Boolean).map((item, i) => (
                    <li key={item.id} className="card podio__menor">
                      <div className="podio__texto">
                        <div className="podio__posicao">
                          <span className="podio__numero podio__numero--menor">
                            <span className="visualmente-oculto">Posição </span>
                            {String(i + 2).padStart(2, '0')}
                          </span>
                          <FonteDoItem item={item} tamanho={22} />
                        </div>
                        <h2 className="card__titulo">
                          <LinkItem item={item}>{item.titulo}</LinkItem>
                        </h2>
                        <Numeros item={item} />
                      </div>
                    </li>
                  ))}
                </ol>
              </li>
            </ol>
          )}

          {lista.length > 3 && (
            <section aria-labelledby="ranking-titulo" className="secao secao--perto">
              <CabecalhoSecao id="ranking-titulo" titulo="Do 4º ao 10º lugar" />
              <ol className="ranking-lista" start={4}>
                {lista.slice(3, 10).map((item, i) => (
                  <li key={item.id} className="ranking-linha">
                    <span className="ranking-linha__numero" aria-hidden="true">
                      {String(i + 4).padStart(2, '0')}
                    </span>
                    <div className="ranking-linha__texto">
                      <h3 className="card__titulo">
                        <LinkItem item={item}>{item.titulo}</LinkItem>
                      </h3>
                      <div className="ranking-linha__meta">
                        <FonteDoItem item={item} tamanho={20} />
                        <Numeros item={item} />
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </>
      )}
    </div>
  )
}
