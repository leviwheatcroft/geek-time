import {
  set,
  get
} from 'lodash'
import {
  getDefaultOptions, loadPlugins
} from '@lib/plugins'
import { error } from '@lib/log'
// import debug from 'debug'
// const dbg = debug('gt')

export const options: Options = {
  get: (path: string) => get(options, path),
  set: (path: string, value: any) => set(options, path, value),
  plugins: {}
}

export async function loadOptions () {
  let fileOptions
  try {
    fileOptions = await import(`../../config/${process.argv[2]}`)
  } catch (err) {
    error('couldn\'t import config')
  }

  await loadPlugins(fileOptions.plugins)
  
  const defaults = getDefaultOptions()

  const args = {}
  process.argv.slice(3).forEach((arg) => {
    const [ k, v ] = arg.split('=')
    set(args, k, v)
  })

  const plugins = {}
  Object.entries(defaults).forEach(([ name, defaults ]) => {
    plugins[name] = Object.assign(
      {},
      defaults,
      fileOptions.plugins[name],
      args[name]
    )
  })

  Object.assign(
    options,
    fileOptions,
    { plugins }
  )
}

