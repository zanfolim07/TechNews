import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function VoltarAoTopo() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    function aoRolar() {
      setVisivel(window.scrollY > 600)
    }
    window.addEventListener('scroll', aoRolar)
    return () => window.removeEventListener('scroll', aoRolar)
  }, [])

  if (!visivel) return null

  return (
    <button
      type="button"
      className="voltar-topo"
      aria-label="Voltar ao topo"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  )
}
