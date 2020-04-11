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
import debug from 'debug'
const dbg = debug('gt')

import mongoose from 'mongoose'

let plugins: { [key: string]: mongoose.Plugin }

export async function loadPlugins (
  pluginDefinitions: { [key: string]: PluginDefinition }
) {
  const _plugins = {}
  const entries = Object.entries(pluginDefinitions)
  for await (const [ name, definition ] of entries) {
    const module = definition.module || definition.name || name
    const plugin: mongoose.Plugin = await import(module)
    .catch(() => import(`../../corePlugins/${module}`))
    .catch(() => import(`../../plugins/${module}`))
    .catch((err) => {
      console.error(`couldn't load plugin: ${module}`)
      throw err
    })
    
    _plugins[name] = plugin
  }
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
    try {
      await plugin.middleware(ctx)
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