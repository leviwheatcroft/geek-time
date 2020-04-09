import {
  info,
  initialiseLog
} from '@lib/log'
import {
  options
} from '@lib/options'
import {
  importCommand,
  exportCommand
} from './commands'
import dotEnv from 'dotenv-flow'
import { loadPlugins } from '@lib/plugins'
import {
  initialiseDb,
  disconnectDb
} from '@lib/db'

dotEnv.config()
console.log('dotenv')
console.log(process.env.MONGO_DB_URI)

async function run () {
  await initialiseDb()
  initialiseLog()
  await loadPlugins()
  

  const [ command ] = options.get('_')

  if (command === 'import') await importCommand(options)
  if (command === 'export') await exportCommand(options)

  info('disconnecting')
  disconnectDb()
}

run()