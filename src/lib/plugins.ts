import {
  getContext
} from './context'
import {
  options
} from './options'
import {
  verbose,
  error,
  info
} from './log'
import {
  nativeRequire
} from './nativeRequire'
import debug from 'debug'

import mongoose from 'mongoose'

let plugins: { [key: string]: mongoose.Plugin }

export async function loadPlugins (
  pluginDefinitions: { [key: string]: PluginDefinition }
) {
  const _plugins = {}
  Object.entries(pluginDefinitions).forEach(([name, definition]) => {
    const module = definition.module || definition.name || name
    const paths = [
      module,
      `../corePlugins/${module}`,
      `../plugins/${module}`
    ]
    let plugin
    while (paths.length) {
      try {
        const path = paths.shift()
        // eslint-disable-next-line import/no-dynamic-require, global-require
        plugin = nativeRequire(path)
      } catch (err) {
        // noop
      }
    }
    if (!plugin)
      throw new Error(`couldn't load plugin: ${module}`)

    _plugins[name] = plugin
  })
  plugins = _plugins
}

export const getDefaultOptions: () => { [key: string]: any } = function () {
  const defaultOptions: { [key: string]: any } = {}
  Object.entries(plugins).forEach(([ name, plugin ]) => {
    defaultOptions[name] = plugin.defaultOptions
  })
  return defaultOptions
}

export function checkOptions () {
  const ctx = getContext(options)
  const errors = []
  const entries = Object.entries(plugins)
  entries.forEach(([name, plugin]) => {
    ctx.pluginOptions = options.plugins[name]
    errors.concat(plugin.checkOptions(ctx))
  })
  if (errors.length) {
    error('configuration errors:', errors)
    throw new Error('configuration errors')
  }
}

export async function applyPlugins () {
  const ctx = getContext(options)
  const entries = Object.entries(plugins)
  for await (const [name, plugin] of entries) {
    ctx.pluginOptions = options.plugins[name]
    const middlewareName = options.plugins[name].middleware || 'middleware'
    try {
      await plugin[middlewareName](ctx)
      verbose(`${plugin.name} data:`, {
        table: ctx.table,
        tableMeta: ctx.tableMeta
      })
    } catch (err) {
      error(`${plugin.name} threw error.`)
      error(err)
      error(`${plugin.name} data:`, {
        table: ctx.table,
        tableMeta: ctx.tableMeta
      })
    }
  }
}