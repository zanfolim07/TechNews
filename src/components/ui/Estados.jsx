import { Inbox, Info, RefreshCw, TriangleAlert } from 'lucide-react'

export function EstadoVazio({ titulo, children = null, acoes = null, Icone = Inbox }) {
  return (
    <div className="estado">
      <span className="estado__icone" aria-hidden="true">
        <Icone size={24} strokeWidth={1.75} />
      </span>
      <h2>{titulo}</h2>
      {children && <p>{children}</p>}
      {acoes && <div className="estado__acoes">{acoes}</div>}
    </div>
  )
}

export function EstadoErro({ aoTentarDeNovo }) {
  return (
    <div className="estado estado--erro" role="alert">
      <span className="estado__icone" aria-hidden="true">
        <TriangleAlert size={24} strokeWidth={1.75} />
      </span>
      <h2>Não foi possível carregar</h2>
      <p>
        Verifique sua conexão e tente de novo. Se o problema continuar, volte em alguns minutos.
      </p>
      <div className="estado__acoes">
        <button type="button" className="btn btn--primario" onClick={aoTentarDeNovo}>
          Tentar novamente
          <RefreshCw size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function AvisoFontes({ fontes }) {
  const comFalha = fontes?.filter((f) => !f.ok) ?? []
  if (comFalha.length === 0) return null
  const nomes = comFalha.map((f) => f.nome).join(', ')
  return (
    <p className="aviso-direitos aviso-fontes" role="status">
      <Info size={16} aria-hidden="true" />
      {nomes} {comFalha.length === 1 ? 'indisponível' : 'indisponíveis'}. Não conseguimos ler{' '}
      {comFalha.length === 1 ? 'o feed' : 'esses feeds'} agora. Nova tentativa em 30 min.
    </p>
  )
}

export function Esqueleto({ largura = '100%', altura = 16, raio = 8 }) {
  return (
    <div className="esqueleto" style={{ width: largura, height: altura, borderRadius: raio }} />
  )
}

export function EsqueletoCard() {
  return (
    <div className="card card-v" aria-hidden="true">
      <Esqueleto altura={190} raio={12} />
      <div className="card-v__corpo">
        <Esqueleto largura="120px" altura={22} raio={999} />
        <Esqueleto largura="90%" altura={20} />
        <Esqueleto largura="70%" altura={20} />
        <Esqueleto largura="40%" altura={14} />
      </div>
    </div>
  )
}

export function EsqueletoLinha() {
  return (
    <div className="card-h" aria-hidden="true" style={{ border: 0 }}>
      <div className="esqueleto esqueleto-imagem" />
      <div className="card-h__corpo" style={{ flex: 1 }}>
        <Esqueleto largura="140px" altura={22} raio={999} />
        <Esqueleto largura="90%" altura={20} />
        <Esqueleto largura="70%" altura={20} />
        <Esqueleto largura="40%" altura={14} />
      </div>
    </div>
  )
}

export function Carregando({ children, rotulo = 'Carregando notícias' }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="visualmente-oculto">{rotulo}…</span>
      {children}
    </div>
  )
}
