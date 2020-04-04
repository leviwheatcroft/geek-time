interface Context {
  table: Table,
  meta: {
    [key: string]: any
  },
  options: {
    [key: string]: any
  },
  log: {
    silly:  (initial: any, ...rest: any) => void,
    verbose:  (initial: any, ...rest: any) => void,
    info: (initial: any, ...rest: any) => void,
    warn:  (initial: any, ...rest: any) => void,
    error:  (initial: any, ...rest: any) => void
  }
}