import { createReadStream, existsSync, statSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toNodeListener } from 'h3'
import { createAgent } from '@metacubexd/agent'
import { WebSocket, WebSocketServer } from 'ws'
import { loadRuntimeConfig, normalizeExternalController } from './config.js'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distDir = join(projectRoot, 'dist')
const config = loadRuntimeConfig()
process.env.DATA_DIR ||= config.dataDir

const contentTypes: Record<string, string> = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.wasm': 'application/wasm',
  '.woff2': 'font/woff2',
}

const agent = createAgent({
  binaryPath: config.binaryPath,
  runtimeRoot: config.runtimeRoot,
  dataDir: config.dataDir,
  kernelDir: config.coreStorageDir,
  homeDir: config.configDir,
  activeConfigPath: join(config.configDir, 'active.yaml'),
  profilesDir: config.profilesDir,
  externalController: normalizeExternalController(config.apiHost),
  secret: config.apiSecret,
  agentToken: config.agentToken,
})
const controlListener = toNodeListener(agent.router)
const websocketServer = new WebSocketServer({ noServer: true })

const proxyMihomoWebSocket = (req: IncomingMessage, socket: import('node:stream').Duplex, head: Buffer) => {
  const requestUrl = new URL(req.url || '/', 'http://localhost')
  const upstream = new URL(config.apiHost)
  upstream.protocol = upstream.protocol === 'https:' ? 'wss:' : 'ws:'
  upstream.pathname = `${upstream.pathname.replace(/\/+$/, '')}${requestUrl.pathname.replace(/^\/api\/mihomo/, '') || '/'}`
  upstream.search = requestUrl.search

  const headers: Record<string, string> = {}
  if (config.apiSecret) headers.Authorization = `Bearer ${config.apiSecret}`

  websocketServer.handleUpgrade(req, socket, head, (client) => {
    const upstreamSocket = new WebSocket(upstream, { headers })
    const closeBoth = () => {
      if (client.readyState === WebSocket.OPEN || client.readyState === WebSocket.CONNECTING) client.close()
      if (upstreamSocket.readyState === WebSocket.OPEN || upstreamSocket.readyState === WebSocket.CONNECTING) upstreamSocket.close()
    }

    upstreamSocket.on('open', () => {
      client.on('message', (data, isBinary) => {
        if (upstreamSocket.readyState === WebSocket.OPEN) upstreamSocket.send(data, { binary: isBinary })
      })
      upstreamSocket.on('message', (data, isBinary) => {
        if (client.readyState === WebSocket.OPEN) client.send(data, { binary: isBinary })
      })
    })
    client.on('close', closeBoth)
    upstreamSocket.on('close', closeBoth)
    client.on('error', closeBoth)
    upstreamSocket.on('error', closeBoth)
  })
}

async function proxyMihomo(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const requestUrl = new URL(req.url || '/', 'http://localhost')
  const upstream = new URL(config.apiHost)
  upstream.pathname = `${upstream.pathname.replace(/\/+$/, '')}${requestUrl.pathname.replace(/^\/api\/mihomo/, '') || '/'}`
  upstream.search = requestUrl.search

  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))

  const headers: Record<string, string> = {}
  if (config.apiSecret) headers.Authorization = `Bearer ${config.apiSecret}`
  const contentType = req.headers['content-type']
  if (contentType) headers['content-type'] = contentType

  const response = await fetch(upstream, {
    method: req.method,
    headers,
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  })

  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== 'content-encoding') res.setHeader(key, value)
  })
  res.end(Buffer.from(await response.arrayBuffer()))
}

async function sendStatic(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const candidate = normalize(join(distDir, relative))
  const filePath = candidate.startsWith(distDir) ? candidate : join(distDir, 'index.html')
  const finalPath = existsSync(filePath) && statSync(filePath).isFile()
    ? filePath
    : join(distDir, 'index.html')

  if (!existsSync(finalPath)) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Frontend build not found. Run pnpm build first.')
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', contentTypes[extname(finalPath)] || 'application/octet-stream')
  createReadStream(finalPath).pipe(res)
}

const server = createServer((req, res) => {
  if ((req.url || '').split('?')[0].startsWith('/api/control')) {
    controlListener(req, res)
    return
  }
  if ((req.url || '').split('?')[0].startsWith('/api/mihomo')) {
    void proxyMihomo(req, res).catch((error: unknown) => {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }))
    })
    return
  }
  void sendStatic(req, res)
})

server.on('upgrade', (req, socket, head) => {
  if ((req.url || '').split('?')[0].startsWith('/api/mihomo/')) {
    proxyMihomoWebSocket(req, socket, head)
    return
  }
  socket.destroy()
})

const shutdown = async (signal: string) => {
  console.log(`[qoqclashd] received ${signal}, shutting down`)
  server.close()
  await agent.supervisor.dispose()
  process.exit(0)
}

process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))

await mkdir(distDir, { recursive: true })
server.listen(config.port, config.host, () => {
  console.log(`[qoqclashd] listening on http://${config.host}:${config.port}`)
  console.log('[qoqclashd] control API mounted at /api/control')
})
