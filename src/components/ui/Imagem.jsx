import { useState } from 'react'

export function Imagem({ src, alt = '', className = '', prioridade = false }) {
  const [falhou, setFalhou] = useState(false)

  if (!src || falhou) return null

  return (
    <div className={`imagem ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={prioridade ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onError={() => setFalhou(true)}
      />
    </div>
  )
}
