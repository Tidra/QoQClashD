declare module 'sql.js' {
  export interface Statement {
    bind(parameters: unknown[]): void
    step(): boolean
    getAsObject(): Record<string, unknown>
    free(): void
  }

  export interface Database {
    run(sql: string, parameters?: unknown[]): void
    prepare(sql: string): Statement
    export(): Uint8Array
  }

  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => Database
  }

  const initSqlJs: (options?: {
    locateFile?: (file: string) => string
  }) => Promise<SqlJsStatic>
  export default initSqlJs
}
