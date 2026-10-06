import { useEffect, useState } from 'react'

const cache = {}

function useApi(url) {
  const [dados, setDados] = useState(cache[url] ?? null)
  const [erro, setErro] = useState(null)
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (cache[url]) return

    fetch(url)
      .then((resposta) => {
        if (!resposta.ok) throw new Error(`Erro ${resposta.status}`)
        return resposta.json()
      })
      .then((json) => {
        cache[url] = json
        setDados(json)
      })
      .catch((e) => setErro(e.message))
  }, [url, tentativa])

  function recarregar() {
    delete cache[url]
    setErro(null)
    setTentativa(tentativa + 1)
  }

  return { dados, erro, recarregar }
}

export const useNoticias = () => useApi('/api/noticias')
export const useEmAlta = () => useApi('/api/em-alta')
export const useReleases = () => useApi('/api/releases')
