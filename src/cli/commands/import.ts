import { info } from "@lib/log"
import nconf from 'nconf'
import {
  promises as fsPromises
} from 'fs'
import papa from 'papaparse'
import {
  isTable
} from '@typeGuards'
import {
  applyMiddlewares
} from '@lib/middlewares'

const {
  readFile
} = fsPromises

export async function importCommand (options: nconf.Provider) {
  info('import command')
  const file = options.get('file')
  const read = await readFile(file, 'utf-8')
  const parsed = papa.parse(read, { header: true })
  const table = parsed.data
  if (!isTable(table))
    throw new RangeError()
  applyMiddlewares('input', table)
}
