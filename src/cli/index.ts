import {
  info
} from '@lib/log'
import {
  options,
  loadOptions
} from '@lib/options'
import dotEnv from 'dotenv-flow'
import {
  applyPlugins
} from '@lib/plugins'
import {
  initialiseDb,
  disconnectDb
} from '@lib/db'

dotEnv.config()

async function run () {
  await loadOptions()
  await initialiseDb()
  await applyPlugins()
  await disconnectDb()
}

run()