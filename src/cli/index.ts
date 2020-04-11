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
  try {
    await loadOptions()
  } catch (err) {
    
    console.error('error loading options')
    console.error(err)
  }
  await initialiseDb()
  await applyPlugins()
  await disconnectDb()
}

run()