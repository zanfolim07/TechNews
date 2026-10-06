import { useEffect } from 'react'

export function useTituloPagina(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} · Tech News` : 'Tech News'
  }, [titulo])
}
