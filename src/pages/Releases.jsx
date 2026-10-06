import { ArrowUpRight, Info } from 'lucide-react'
import { useSearchParams } from 'react-router'
import { AREAS } from '../../config/ferramentas'
import {
  AtualizadoHa,
  BadgeTipo,
  CabecalhoPagina,
  LinkExterno,
  Trilha,
} from '../components/ui/Basicos'
import { LogoFerramenta } from '../components/ui/LogoFerramenta'
import { Carregando, Esqueleto, EstadoErro, EstadoVazio } from '../components/ui/Estados'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { useReleases } from '../lib/api'
import { dataCompleta, tempoRelativo } from '../lib/tempo'

const EXPLICACAO = [
  {
    tipo: 'Major',
    texto:
      'Muda o primeiro número. Pode quebrar compatibilidade: leia o changelog antes de atualizar.',
  },
  {
    tipo: 'Minor',
    texto: 'Muda o número do meio. Traz recursos novos sem quebrar o que já funciona.',
  },
  {
    tipo: 'Patch',
    texto: 'Muda o último número. Corrige bugs e falhas de segurança; atualize sem medo.',
  },
]

export function Releases() {
  useTituloPagina('Releases')
  const [params, setParams] = useSearchParams()
  const area = params.get('area') ?? ''
  const { dados, erro, recarregar } = useReleases()
  const lista = dados?.releases.filter((r) => !area || r.area === area) ?? []

  return (
    <div className="container">
      <Trilha itens={[{ rotulo: 'Releases' }]} />
      <div className="topo-com-acoes">
        <CabecalhoPagina rotulo="Para devs" titulo="Releases">
          Novas versões das linguagens e ferramentas mais usadas, lidas direto do GitHub a cada 30
          minutos. Versões de teste (pre-releases) ficam de fora.
        </CabecalhoPagina>
        <div className="topo-com-acoes__lado">
          <AtualizadoHa quando={dados?.atualizadoEm} />
        </div>
      </div>

      {}
      <section aria-labelledby="como-ler" className="caixa-semver">
        <h2 id="como-ler">Como ler uma versão</h2>
        <p>
          Quase todos os projetos seguem o formato <span className="mono">MAJOR.MINOR.PATCH</span>.
          Exemplo: na versão <span className="mono">19.3.0</span>, 19 é o major, 3 é o minor e 0 é o
          patch.
        </p>
        <div className="caixa-semver__grade">
          {EXPLICACAO.map((e) => (
            <div key={e.tipo} className="caixa-semver__item">
              <BadgeTipo tipo={e.tipo} />
              <p>{e.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="barra-filtros">
        <div role="group" aria-label="Filtrar por área" className="chips">
          {['', ...AREAS].map((a) => (
            <button
              key={a}
              type="button"
              className="chip"
              aria-pressed={area === a}
              onClick={() => setParams(a ? { area: a } : {}, { preventScrollReset: true })}
            >
              {a || 'Todas'}
            </button>
          ))}
        </div>
        {dados && (
          <span className="data" aria-live="polite">
            {lista.length} {lista.length === 1 ? 'ferramenta' : 'ferramentas'}
          </span>
        )}
      </div>

      {erro && <EstadoErro aoTentarDeNovo={recarregar} />}
      {!dados && !erro && (
        <Carregando rotulo="Carregando releases">
          <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <Esqueleto key={i} altura={64} raio={12} />
            ))}
          </div>
        </Carregando>
      )}

      {}
      {dados && dados.falhas.length > 0 && (
        <p className="aviso-direitos" role="status" style={{ marginTop: 0, marginBottom: 20 }}>
          <Info size={16} aria-hidden="true" />
          Não foi possível consultar agora: {dados.falhas.map((f) => f.nome).join(', ')}. O GitHub
          permite poucas consultas por hora; essas versões aparecem automaticamente na próxima
          atualização (em até 30 min).
        </p>
      )}

      {dados && lista.length === 0 && (
        <EstadoVazio titulo="Nenhuma release nesta área">
          Escolha outra área ou veja todas.
        </EstadoVazio>
      )}

      {lista.length > 0 && (
        <ul className="releases-lista">
          {lista.map((r) => (
            <li key={r.slug} className="release">
              <div className="release__nome">
                <LogoFerramenta slug={r.slug} sigla={r.sigla} cor={r.cor} />
                <div>
                  <h2>{r.nome}</h2>
                  <p className="data">
                    {r.area} ·{' '}
                    {r.data ? (
                      <time dateTime={r.data} title={dataCompleta(r.data)}>
                        lançada {tempoRelativo(r.data)}
                      </time>
                    ) : (
                      'data não informada'
                    )}
                  </p>
                </div>
              </div>
              <div className="release__versao">
                <span className="mono release__numero">v{r.versao}</span>
                <BadgeTipo tipo={r.tipo} />
                <LinkExterno href={r.link} className="btn btn--secundario release__link">
                  Changelog
                  <ArrowUpRight size={14} aria-hidden="true" />
                </LinkExterno>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
