import { existsSync } from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function apiLocal() {
  return {
    name: 'api-local',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const nome = (req.url ?? '').split('?')[0].replace(/^\/|\/$/g, '')
        const arquivo = path.resolve('api', `${nome}.js`)
        if (!/^[a-z0-9-]+$/.test(nome) || !existsSync(arquivo)) return next()

        try {
          const modulo = await server.ssrLoadModule(arquivo)
          const handler = modulo[req.method ?? 'GET']
          if (typeof handler !== 'function') {
            res.statusCode = 405
            return res.end('Método não permitido')
          }

          const request = new Request(`http://${req.headers.host}${req.originalUrl}`, {
            method: req.method,
          })
          const resposta = await handler(request)

          res.statusCode = resposta.status
          resposta.headers.forEach((valor, chave) => res.setHeader(chave, valor))
          res.end(Buffer.from(await resposta.arrayBuffer()))
        } catch (erro) {
          server.config.logger.error(String(erro))
          res.statusCode = 500
          res.end('Erro na função da API')
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.GITHUB_TOKEN) process.env.GITHUB_TOKEN = env.GITHUB_TOKEN

  return {
    plugins: [react(), apiLocal()],
  }
})
