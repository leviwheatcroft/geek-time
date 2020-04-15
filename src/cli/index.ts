import {
  error
} from '@lib/log'
import {
  loadOptions
} from '@lib/options'
import dotEnv from 'dotenv-flow'
import {
  applyPlugins
} from '@lib/plugins'

dotEnv.config()

async function run () {
  try {
    await loadOptions()
  } catch (err) {
    error('error loading options')
    error(err)
    return
  }

  try {
    await applyPlugins()
  } catch (err) {
    error('error applying plugins')
    error(err)
    return
  }

}

run()
