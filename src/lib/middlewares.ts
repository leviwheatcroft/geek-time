import {
  options
} from './options'
import {
  context
} from './context'
import {
  isMiddleware
} from '@typeGuards'
import {
  verbose,
  error
} from './log'
import corePlugins from './corePlugins'


const middlewareDefinitions = [
  ...options.get('middlewares')
]
const middlewares: Array<Middleware> = corePlugins

export async function loadMiddlewares () {
  middlewareDefinitions.forEach((d) => {
    const middleware = import(d)
    if (!isMiddleware(middleware))
      throw new RangeError()
    middlewares.push(middleware)
  })
}

export async function applyMiddlewares (hook: Hook, table: Table) {
  const ctx = context(table, options)
  for await (const middleware of middlewares) {
    if (!middleware[hook]) return
    try {
      await middleware[hook](ctx)
      verbose(`${middleware.name} data:`)
      verbose(ctx.table)
      verbose(`${middleware.name} meta:`)
      verbose(ctx.meta)
    } catch (err) {
      error(`${middleware.name} threw error.`)
      error(err)
      error(ctx.table)
    }
  }
}