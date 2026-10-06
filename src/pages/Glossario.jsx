import { ArrowRight, Search, SearchX } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { CabecalhoPagina, Trilha } from '../components/ui/Basicos'
import { EstadoVazio } from '../components/ui/Estados'
import { useTituloPagina } from '../hooks/useTituloPagina'
import { TERMOS, filtrarTermos } from '../lib/glossario'
import { destacar } from '../lib/texto'

export function Glossario() {
  useTituloPagina('Glossário')

  const [consulta, setConsulta] = useState('')
  const termos = filtrarTermos(consulta)

  return (
    <div className="container">
      <Trilha itens={[{ rotulo: 'Glossário' }]} />
      <CabecalhoPagina rotulo="Aprenda" titulo="Glossário tech">
        Termos de TI explicados em poucas linhas, para entender as notícias sem travar. Eles também
        aparecem na página de cada notícia, em “Termos desta notícia”.
      </CabecalhoPagina>

      <div className="campo glossario__busca">
        <label htmlFor="busca-termo" className="visualmente-oculto">
          Buscar termo
        </label>
        <span className="campo__icone" aria-hidden="true">
          <Search size={20} />
        </span>
        <input
          id="busca-termo"
          type="search"
          value={consulta}
          onChange={(e) => setConsulta(e.target.value)}
          placeholder="Buscar termo, como API ou deploy"
          autoComplete="off"
        />
      </div>
      <p className="data" aria-live="polite" style={{ marginBottom: 20 }}>
        {consulta ? `${termos.length} de ${TERMOS.length} termos` : `${TERMOS.length} termos`}
      </p>

      {termos.length === 0 ? (
        <EstadoVazio
          Icone={SearchX}
          titulo="Nenhum termo encontrado"
          acoes={
            <button type="button" className="btn btn--secundario" onClick={() => setConsulta('')}>
              Ver a lista completa
            </button>
          }
        >
          Tente outra palavra ou veja a lista completa.
        </EstadoVazio>
      ) : (
        <ul className="grade grade--3 glossario__lista">
          {termos.map((t) => (
            <li key={t.termo} className="termo">
              <span className="termo__area">{t.area.toUpperCase()}</span>
              <h2>{destacar(t.termo, consulta)}</h2>
              <p>{destacar(t.definicao, consulta)}</p>
              <Link to={`/busca?q=${encodeURIComponent(t.termo)}`} className="link-seta">
                Notícias sobre o tema <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
