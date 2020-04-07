import nconf from 'nconf'
import {
  args
} from './args'
import { info } from '@lib/log'

nconf.argv(args)
nconf.file('config.json')

nconf.defaults({
  middlewares: []
})

export const options = nconf