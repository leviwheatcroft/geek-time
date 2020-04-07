import mongoose from 'mongoose'
import nconf from 'nconf'
import {
  silly,
  verbose,
  info,
  warn,
  error
} from '@lib/log'
export function context (
  table: mongoose.Table,
  options: nconf.Provider
): mongoose.Context {
  const tableMeta = {}
  return {
    table,
    tableMeta,
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