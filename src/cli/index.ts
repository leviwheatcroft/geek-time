import dotEnv from 'dotenv-flow'
dotEnv.config()

import {
  error
} from '@lib/log'
import {
  loadOptions
} from '@lib/options'

import {
  applyPlugins,
  checkOptions
} from '@lib/plugins'



async function run () {
  try {
    await loadOptions()
    checkOptions()
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
