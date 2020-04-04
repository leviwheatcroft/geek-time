import nconf from 'nconf'
import {
  silly,
  verbose,
  info,
  warn,
  error
} from '@lib/log'
export function context (
  table: Table,
  options: nconf.Provider
): Context {
  const meta = {}
  return {
    table,
    meta,
    options,
    log: {
      silly,
      verbose,
      info,
      warn,
      error
    }
  }
}