import { Outlet, ScrollRestoration } from 'react-router'
import { Footer } from './Footer'
import { Header } from './Header'
import { VoltarAoTopo } from './VoltarAoTopo'

export function Layout() {
  return (
    <div className="pagina">
      {}
      <a href="#conteudo" className="pular-conteudo">
        Pular para o conteúdo
      </a>

      <Header />

      <main id="conteudo" className="pagina__conteudo" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />

      <VoltarAoTopo />

      {}
      <ScrollRestoration getKey={(local) => local.pathname + local.search} />
    </div>
  )
}
