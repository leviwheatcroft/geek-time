import mongoose from 'mongoose'
import is from 'is'
import {
  silly,
  verbose,
  info,
  warn,
  error
} from '@lib/log'
import {
  options
} from './options'

export function getContext (
  options: Options,
  table: mongoose.Table = []
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
    },
    is
  }
}