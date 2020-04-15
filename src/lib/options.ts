import {
  set,
  get
} from 'lodash'
import {
  getDefaultOptions, loadPlugins
} from '@lib/plugins'
import { error } from '@lib/log'
import {
  promises as fsPromises
} from 'fs'
const {
  readFile
} = fsPromises
import yaml from 'yaml'
import debug from 'debug'
const dbg = debug('gt')

export const options: Options = {
  get: (path: string) => get(options, path),
  set: (path: string, value: any) => set(options, path, value),
  plugins: {}
}

// loadOptions
// paths for import() are mangled by typescript, so they will be relative
// to the output directory
// paths for readFile are not, so they must be specified relative to cwd
export async function loadOptions () {
  const fileOptions = await import(`../../config/${process.argv[2]}`)
  .catch(() => {
    return readFile(`./config/${process.argv[2]}.yaml`, 'utf8')
      .then((raw) => yaml.parse(raw))
  })
  .catch((err) => {
    console.error('couldn\'t import config')
    throw err
  })

  try {
    await loadPlugins(fileOptions.plugins)
  } catch (err) {
    console.error('couldn\'t load plugins')
    throw err
  }

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

