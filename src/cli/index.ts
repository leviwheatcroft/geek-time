import {
  info
} from '@lib/log'
import {
  options
} from '@lib/options'
import {
  importCommand
} from './commands'
import { loadMiddlewares } from '@lib/middlewares'

async function run () {
  await loadMiddlewares()

  const [ command ] = options.get('_')

  if (command === 'import') importCommand(options)
}

run()