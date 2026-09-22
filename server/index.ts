import { createAgent, readSessionCookie } from '@metacubexd/agent'
import { toNodeListener } from 'h3'
import {
  createReadStream,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
  writeSync,
} from 'node:fs'
import { mkdir } from 'node:fs/promises'
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import { extname, join, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WebSocket, WebSocketServer, type RawData } from 'ws'
import { loadRuntimeConfig } from './config.js'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const distDir = join(projectRoot, 'dist')
const config = loadRuntimeConfig()
process.env.DATA_DIR ||= config.dataDir

// sql.js 把整个 SQLite 文件读进内存、写回时整文件覆盖，多个后端进程共享同一
// dataDir 会互相踩踏（后 flush 的进程把对方写入抹掉），这里用锁文件禁止双开。
const lockPath = join(config.dataDir, 'server.lock')
const acquireDataLock = () => {
  mkdirSync(config.dataDir, { recursive: true })
  const pidAlive = (pid: number) => {
    try {
      process.kill(pid, 0)
      return true
    } catch {
      return false
    }
  }
  try {
    const fd = openSync(lockPath, 'wx')
    writeSync(fd, String(process.pid))
    return
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
  }
  const holder = Number(readFileSync(lockPath, 'utf8').trim())
  if (holder && holder !== process.pid && pidAlive(holder)) {
    console.error(`[qoqclashd] 已有后端进程 (pid ${holder}) 在使用数据目录 ${config.dataDir}`)
    console.error(
      '[qoqclashd] 多个后端共享同一个 SQLite 文件会互相覆盖数据，请先停掉另一个实例再启动。',
    )
    process.exit(1)
  }
  writeFileSync(lockPath, String(process.pid))
}
acquireDataLock()

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
})
const controlListener = toNodeListener(agent.router)
const websocketServer = new WebSocketServer({ noServer: true })

// /api/control 的鉴权在 agent 的路由中间件里；/api/mihomo 由本文件自己转发，必须
// 用同一张会话 cookie 把关，否则未登录也能绕过面板直读直写内核。
const hasPanelSession = (req: IncomingMessage) =>
  agent.sessions.verify(readSessionCookie(req.headers.cookie))

// 内核的 API 地址与密码都归 agent 托管：地址固定本机回环、端口设置页可改（KV 持久化），
// secret 在面板密码落地前由 supervisor 随机生成。所以每次转发都读 supervisor 的实时状态，
// 而不是启动时快照。
const WILDCARD_HOSTS = new Set(['0.0.0.0', '::', '[::]'])
const mihomoUpstream = () => {
  // secret 只能走 getControllerSecret()：它故意不在 getState() 里，状态对象会被
  // 控制接口和 SSE 帧原样序列化下发。
  const { externalController } = agent.supervisor.getState()
  const secret = agent.supervisor.getControllerSecret()
  const withScheme = externalController.startsWith('http')
    ? externalController
    : `http://${externalController}`
  const url = new URL(withScheme)
  // 内核绑通配地址时，客户端 socket 连 0.0.0.0/:: 不一定可路由（同 supervisor
  // 的就绪轮询）。
  if (WILDCARD_HOSTS.has(url.hostname)) url.hostname = '127.0.0.1'
  return { url, secret }
}

const proxyMihomoWebSocket = (
  req: IncomingMessage,
  socket: import('node:stream').Duplex,
  head: Buffer,
) => {
  const requestUrl = new URL(req.url || '/', 'http://localhost')
  const { url: upstream, secret } = mihomoUpstream()
  upstream.protocol = upstream.protocol === 'https:' ? 'wss:' : 'ws:'
  upstream.pathname = `${upstream.pathname.replace(/\/+$/, '')}${requestUrl.pathname.replace(/^\/api\/mihomo/, '') || '/'}`
  upstream.search = requestUrl.search

  const headers: Record<string, string> = {}
  if (secret) headers.Authorization = `Bearer ${secret}`

  websocketServer.handleUpgrade(req, socket, head, (client) => {
    const upstreamSocket = new WebSocket(upstream, { headers })
    const closeBoth = () => {
      if (client.readyState === WebSocket.OPEN || client.readyState === WebSocket.CONNECTING)
        client.close()
      if (
        upstreamSocket.readyState === WebSocket.OPEN ||
        upstreamSocket.readyState === WebSocket.CONNECTING
      )
        upstreamSocket.close()
    }

    // 客户端一般在 onopen 里就发出订阅帧，那时上游常常还没连上；旧写法把监听挂在
    // 上游 open 之后，早到的帧被直接丢掉，表现为"连上了却一直不出数据"。
    const pending: Array<[RawData, boolean]> = []
    client.on('message', (data, isBinary) => {
      if (upstreamSocket.readyState === WebSocket.OPEN)
        upstreamSocket.send(data, { binary: isBinary })
      else if (upstreamSocket.readyState === WebSocket.CONNECTING) pending.push([data, isBinary])
    })

    upstreamSocket.on('open', () => {
      for (const [data, binary] of pending.splice(0)) upstreamSocket.send(data, { binary })
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
  const { url: upstream, secret } = mihomoUpstream()
  upstream.pathname = `${upstream.pathname.replace(/\/+$/, '')}${requestUrl.pathname.replace(/^\/api\/mihomo/, '') || '/'}`
  upstream.search = requestUrl.search

  const chunks: Buffer[] = []
  for await (const chunk of req) chunks.push(Buffer.from(chunk))

  const headers: Record<string, string> = {}
  if (secret) headers.Authorization = `Bearer ${secret}`
  const contentType = req.headers['content-type']
  if (contentType) headers['content-type'] = contentType

  const response = await fetch(upstream, {
    method: req.method,
    headers,
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  })

  res.statusCode = response.status
  // fetch 已经解压过响应体，上游的 content-encoding/content-length 都不再对应我们
  // 要写出的字节数，照抄会让客户端按错误长度截断或挂起。
  const body = Buffer.from(await response.arrayBuffer())
  response.headers.forEach((value, key) => {
    const name = key.toLowerCase()
    if (name !== 'content-encoding' && name !== 'content-length' && name !== 'transfer-encoding')
      res.setHeader(key, value)
  })
  res.end(body)
}

async function sendStatic(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname
  const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '')
  const candidate = resolve(distDir, relative)
  // 前缀比较必须带上路径分隔符，否则 /app/dist 会把邻居 /app/dist-server 也算"在里面"。
  const inside = candidate === distDir || candidate.startsWith(distDir + sep)
  const filePath = inside ? candidate : join(distDir, 'index.html')
  const finalPath =
    existsSync(filePath) && statSync(filePath).isFile() ? filePath : join(distDir, 'index.html')

  if (!existsSync(finalPath)) {
    res.statusCode = 503
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end('Frontend build not found. Run pnpm build first.')
    return
  }

  res.statusCode = 200
  res.setHeader('Content-Type', contentTypes[extname(finalPath)] || 'application/octet-stream')
  // 客户端中途断开是常态（浏览器换页就 abort），pipe 不接 error 会把进程带崩。
  const stream = createReadStream(finalPath)
  stream.on('error', () => res.destroy())
  stream.pipe(res)
}

const unauthorized = (res: ServerResponse) => {
  res.statusCode = 401
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ error: 'unauthorized' }))
}

const server = createServer((req, res) => {
  if ((req.url || '').split('?')[0].startsWith('/api/control')) {
    controlListener(req, res)
    return
  }
  if ((req.url || '').split('?')[0].startsWith('/api/mihomo')) {
    if (!hasPanelSession(req)) {
      unauthorized(res)
      return
    }
    void proxyMihomo(req, res).catch((error: unknown) => {
      res.statusCode = 502
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(
        JSON.stringify({
          error: error instanceof Error ? error.message : String(error),
        }),
      )
    })
    return
  }
  sendStatic(req, res).catch((error: unknown) => {
    if (res.headersSent) return res.destroy()
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end(`static serving failed: ${error instanceof Error ? error.message : String(error)}`)
  })
})

server.on('upgrade', (req, socket, head) => {
  if ((req.url || '').split('?')[0].startsWith('/api/mihomo/')) {
    if (!hasPanelSession(req)) {
      socket.destroy()
      return
    }
    proxyMihomoWebSocket(req, socket, head)
    return
  }
  socket.destroy()
})

const shutdown = async (signal: string) => {
  console.log(`[qoqclashd] received ${signal}, shutting down`)
  server.close()
  await agent.supervisor.dispose()
  // 只在锁仍然属于本进程时删除：接管别人的锁之后，本进程退出不能把新主人的锁
  // 一起删掉，否则第三个实例能在两个实例都在跑时抢进来。
  try {
    if (Number(readFileSync(lockPath, 'utf8').trim()) === process.pid) unlinkSync(lockPath)
  } catch {
    // 锁文件可能已被清理
  }
  process.exit(0)
}

process.once('SIGINT', () => void shutdown('SIGINT'))
process.once('SIGTERM', () => void shutdown('SIGTERM'))

await mkdir(distDir, { recursive: true })
// 先应用设置页持久化的内核/配置目录，再开始接收控制请求。
await agent.init()
server.listen(config.port, config.host, () => {
  console.log(`[qoqclashd] listening on http://${config.host}:${config.port}`)
  console.log('[qoqclashd] control API mounted at /api/control')
})
