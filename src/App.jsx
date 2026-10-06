import { createBrowserRouter, RouterProvider } from 'react-router'
import { Layout } from './components/layout/Layout'
import { Busca } from './pages/Busca'
import { Editoria } from './pages/Editoria'
import { ErroGeral } from './pages/ErroGeral'
import { EmAlta } from './pages/EmAlta'
import { Fonte } from './pages/Fonte'
import { Fontes } from './pages/Fontes'
import { Glossario } from './pages/Glossario'
import { Home } from './pages/Home'
import { NaoEncontrada } from './pages/NaoEncontrada'
import { Noticia } from './pages/Noticia'
import { Releases } from './pages/Releases'
import { Sobre } from './pages/Sobre'

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <ErroGeral />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/editoria/:slug', element: <Editoria /> },
      { path: '/noticia/:id', element: <Noticia /> },
      { path: '/busca', element: <Busca /> },
      { path: '/em-alta', element: <EmAlta /> },
      { path: '/releases', element: <Releases /> },
      { path: '/glossario', element: <Glossario /> },
      { path: '/fontes', element: <Fontes /> },
      { path: '/fontes/:slug', element: <Fonte /> },
      { path: '/sobre', element: <Sobre /> },

      { path: '*', element: <NaoEncontrada /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
