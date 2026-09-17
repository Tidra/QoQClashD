import { spawn } from 'node:child_process'

const processes = [
  spawn('pnpm', ['exec', 'vite'], {
    stdio: 'inherit',
    env: process.env,
    shell: true,
  }),
  spawn('pnpm', ['exec', 'tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      PANEL_PORT: process.env.PANEL_PORT || '5174',
    },
    shell: true,
  }),
]

let stopping = false
const shutdown = (signal) => {
  if (stopping) return
  stopping = true
  for (const child of processes) {
    if (!child.killed) child.kill(signal)
  }
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))

for (const child of processes) {
  child.once('exit', (code, signal) => {
    if (stopping) return
    shutdown('SIGTERM')
    process.exit(code ?? (signal ? 1 : 0))
  })
}
