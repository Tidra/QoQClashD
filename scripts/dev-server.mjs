import { spawn } from 'node:child_process'

const child = spawn('pnpm', ['exec', 'tsx', 'server/index.ts'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PANEL_PORT: process.env.PANEL_PORT || '5174',
  },
  shell: true,
})

const shutdown = (signal) => {
  if (!child.killed) child.kill(signal)
}

process.once('SIGINT', () => shutdown('SIGINT'))
process.once('SIGTERM', () => shutdown('SIGTERM'))
child.once('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
