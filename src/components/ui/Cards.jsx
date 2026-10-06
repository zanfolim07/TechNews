import { Link } from 'react-router'
import { nomeEditoria } from '../../../config/editorias'
import { tempoRelativo } from '../../lib/tempo'
import { Badge, LinkExterno, Sigla } from './Basicos'
import { Imagem } from './Imagem'

export function MetaFonte({ noticia, tamanhoSigla = 24, mostrarEditoria = false }) {
  return (
    <div className="meta-fonte">
      <Sigla fonteSlug={noticia.fonteSlug} tamanho={tamanhoSigla} />
      <Link to={`/fontes/${noticia.fonteSlug}`} className="meta-fonte__nome acima">
        {noticia.fonte}
      </Link>
      <span className="meta-fonte__separador" aria-hidden="true">
        ·
      </span>
      <time className="data" dateTime={noticia.data}>
        {tempoRelativo(noticia.data)}
      </time>
      {mostrarEditoria && (
        <span className="meta-fonte__editoria">
          <Badge>{nomeEditoria(noticia.editoria)}</Badge>
        </span>
      )}
    </div>
  )
}

export function CardNoticia({ noticia, titulo = null, resumo = null, grande = false }) {
  return (
    <article className={`card card-v ${grande ? 'card-v--grande' : ''}`}>
      <Imagem src={noticia.imagem} />
      <div className="card-v__corpo">
        <h3 className="card__titulo">
          <Link to={`/noticia/${noticia.id}`} className="card__link">
            {titulo ?? noticia.titulo}
          </Link>
        </h3>
        {(resumo ?? noticia.resumo) && <p className="resumo">{resumo ?? noticia.resumo}</p>}
        <MetaFonte noticia={noticia} mostrarEditoria />
      </div>
    </article>
  )
}

export function CardNoticiaHorizontal({ noticia, titulo = null, resumo = null }) {
  return (
    <article className="card card-h">
      <Imagem src={noticia.imagem} />
      <div className="card-h__corpo">
        <h3 className="card__titulo">
          <Link to={`/noticia/${noticia.id}`} className="card__link">
            {titulo ?? noticia.titulo}
          </Link>
        </h3>
        {(resumo ?? noticia.resumo) && <p className="resumo">{resumo ?? noticia.resumo}</p>}
        <MetaFonte noticia={noticia} mostrarEditoria />
      </div>
    </article>
  )
}

export function MiniNoticia({ noticia, pequena = false }) {
  return (
    <Link to={`/noticia/${noticia.id}`} className={`mini lnk ${pequena ? 'mini--pequena' : ''}`}>
      <Imagem src={noticia.imagem} />
      <span className="mini__texto">
        <span className="card__titulo">{noticia.titulo}</span>
        <span className="mini__meta">
          <span>{noticia.fonte}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={noticia.data}>{tempoRelativo(noticia.data)}</time>
        </span>
      </span>
    </Link>
  )
}

export function ItemRanking({ posicao, titulo, meta, para, externo = false }) {
  const conteudo = (
    <>
      <span className="ranking-item__numero" aria-hidden="true">
        {String(posicao).padStart(2, '0')}
      </span>
      <span className="mini__texto">
        <span className="card__titulo">{titulo}</span>
        <span className="mini__meta">{meta}</span>
      </span>
    </>
  )
  return externo ? (
    <LinkExterno href={para} className="ranking-item lnk">
      {conteudo}
    </LinkExterno>
  ) : (
    <Link to={para} className="ranking-item lnk">
      {conteudo}
    </Link>
  )
}
