import mongoose from 'mongoose'
import is from 'is'
import * as _log from '@lib/log'
import debug from 'debug'

const dbg = debug('gt')

export function getContext (
  options: Options
): mongoose.Context {
  const context: any = {
    table: [],
    tableMeta: {},
    pluginOptions: {},
  }

  const plugins = Object.keys(options.plugins)

  let plugin
  context.nextPlugin = function nextPlugin () {
    plugin = plugins.shift()
    context.pluginOptions = options.plugins[plugin]
    // dbg(pluginOptions)
  }

  // prepend log with plugin name
  context.log = Object.assign(
    {},
    _log,
    {
      error: (msg: string, meta: any) => {
        _log.error(`[${plugin}] ${msg}`, meta)
      },
      warn: (msg: string, meta: any) => {
        _log.warn(`[${plugin}] ${msg}`, meta)
      },
      info: (msg: string, meta: any) => {
        _log.info(`[${plugin}] ${msg}`, meta)
      },
      verbose: (msg: string, meta: any) => {
        _log.verbose(`[${plugin}] ${msg}`, meta)
      },
      debug: (msg: string, meta: any) => {
        _log.debug(`[${plugin}] ${msg}`, meta)
      },
      silly: (msg: string, meta: any) => {
        _log.silly(`[${plugin}] ${msg}`, meta)
      }
    }
  )

  return context
}