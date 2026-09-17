import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import initSqlJs from 'sql.js'
import type { Database } from 'sql.js'

export interface AgentStorage {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  delete(key: string): Promise<void>
}

const require = createRequire(import.meta.url)

export function createAgentStorage(
  dataDir: string,
  defaults: Record<string, unknown> = {},
): AgentStorage {
  let database: Database | null = null
  const ready = (async () => {
    await mkdir(dataDir, { recursive: true })
    const file = join(dataDir, 'qoqclashd.sqlite')
    const SQL = await initSqlJs({
      locateFile: (name: string) => join(dirname(require.resolve('sql.js')), name),
    })
    try {
      database = new SQL.Database(new Uint8Array(await readFile(file)))
    } catch {
      database = new SQL.Database()
    }
    database.run(
      'CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)',
    )
    database.run(
      `INSERT INTO kv (key, value) VALUES
        ('nodePools', '[]'),
        ('defaultGroups', '[]'),
        ('config/rules', '[]')
       ON CONFLICT(key) DO NOTHING`,
    )
    for (const [key, value] of Object.entries(defaults)) {
      const encoded = JSON.stringify(value)
      database.run(
        'INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO NOTHING',
        [key, encoded],
      )
    }
    await writeFile(file, Buffer.from(database.export()))

    const persist = async () => {
      if (database) await writeFile(file, Buffer.from(database.export()))
    }
    return { file, persist }
  })()

  return {
    async get(key) {
      await ready
      if (!database) return null
      const statement = database.prepare('SELECT value FROM kv WHERE key = ?')
      statement.bind([key])
      const value = statement.step() ? String(statement.getAsObject().value) : null
      statement.free()
      return value
    },
    async set(key, value) {
      const { persist } = await ready
      if (!database) return
      database.run(
        'INSERT INTO kv (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
        [key, value],
      )
      await persist()
    },
    async delete(key) {
      const { persist } = await ready
      if (!database) return
      database.run('DELETE FROM kv WHERE key = ?', [key])
      await persist()
    },
  }
}
