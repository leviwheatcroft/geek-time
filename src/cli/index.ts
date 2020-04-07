import {
  info
} from '@lib/log'
import {
  options
} from '@lib/options'
import {
  importCommand,
  exportCommand
} from './commands'
import { loadMiddlewares } from '@lib/middlewares'
import { connect, disconnect } from '@lib/db'

async function run () {
  await loadMiddlewares()
  await connect()

  const [ command ] = options.get('_')

  if (command === 'import') await importCommand(options)
  if (command === 'export') await exportCommand(options)

  info('disconnecting')
  await disconnect()
}

run()