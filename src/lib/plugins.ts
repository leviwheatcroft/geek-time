import {
  options
} from './options'
import {
  context
} from './context'
import {
  isPlugin
} from '@typeGuards'
import {
  verbose,
  error,
  info
} from './log'
import corePlugins from './corePlugins'
import mongoose from 'mongoose'


const plugins: { [key: string]: mongoose.Plugin } = corePlugins

export async function loadPlugins () {
  const pluginDefinitions = options.get('plugins') as Array<PluginDefinition>
  Object.entries(pluginDefinitions).forEach(([name, definition]) => {
    let plugin
    try {
      plugin = require(`../../plugins/${definition.uri}`)
    } catch (err) {
      error(`../../plugins/${definition.uri}`)
      error(err)
      throw new Error(`couldn't load plugin: ${definition.uri}`)
    }
    plugins[name] = plugin
  })
}

export async function applyPlugins (
  hook: Hook,
  table: mongoose.Table
) {
  info('apply plugins')
  const ctx = context(table, options)
  for await (const plugin of Object.values(plugins)) {
    if (!plugin[hook]) continue
    ctx.pluginOptions = options.get(`plugins:${plugin.name}`)
    try {
      await plugin[hook](ctx)
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