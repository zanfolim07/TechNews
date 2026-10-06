import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { FONTES_RSS } from '../../../config/fontes'
import { useEmAlta } from '../../lib/api'
import { termoDoDia } from '../../lib/glossario'
import { tempoRelativo } from '../../lib/tempo'
import { ItemRanking } from './Cards'
import { Esqueleto } from './Estados'

export function BlocoEmAlta({ titulo = 'Em alta', quantidade = 5 }) {
  const { dados, erro } = useEmAlta()
  return (
    <section aria-labelledby="bloco-em-alta">
      <div className="bloco__topo">
        <h2 id="bloco-em-alta">{titulo}</h2>
        <Link to="/em-alta" className="link-seta link-seta--suave">
          Ver ranking <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
      {erro && <p className="data">Ranking indisponível no momento.</p>}
      {!dados && !erro && (
        <div aria-hidden="true" style={{ display: 'grid', gap: 18, paddingTop: 14 }}>
          {Array.from({ length: quantidade }, (_, i) => (
            <Esqueleto key={i} altura={38} />
          ))}
        </div>
      )}
      {dados && (
        <ol className="lista-linhas">
          {dados.hoje.slice(0, quantidade).map((item, i) => (
            <li key={item.id}>
              <ItemRanking
                posicao={i + 1}
                titulo={item.titulo}
                meta={`${item.fonte} · ${item.pontos} ${item.fonte === 'TabNews' ? 'TabCoins' : 'pontos'} · ${tempoRelativo(item.data)}`}
                para={item.link}
                externo
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export function CartaoTermoDoDia() {
  const termo = termoDoDia()
  return (
    <section className="cartao-termo" aria-labelledby="termo-dia">
      <span className="cartao-termo__rotulo">TERMO DO DIA</span>
      <h3 id="termo-dia">{termo.termo}</h3>
      <p>{termo.definicao}</p>
      <Link to="/glossario" className="link-seta">
        Abrir glossário <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </section>
  )
}

export function CartaoFontes() {
  return (
    <section className="cartao-fontes" aria-labelledby="cartao-fontes">
      <span className="cartao-fontes__rotulo">DE ONDE VÊM AS NOTÍCIAS</span>
      <h3 id="cartao-fontes">Reunimos o que importa, direto das fontes.</h3>
      <p>Cada notícia leva para a matéria original. Atualizado a cada 30 minutos.</p>
      <div className="cartao-fontes__lista">
        {FONTES_RSS.map((f) => (
          <Link key={f.slug} to={`/fontes/${f.slug}`}>
            {f.nome}
          </Link>
        ))}
      </div>
      <Link to="/sobre" className="link-seta">
        Sobre o projeto <ArrowRight size={15} aria-hidden="true" />
      </Link>
    </section>
  )
}
