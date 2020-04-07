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
import asyncPool from 'tiny-async-pool'
import {
  TagModel,
  RowModel
} from "@lib/db"
import {
  csv
} from '@lib/transformers'

const {
  readFile
} = fsPromises

export async function importCommand (options: nconf.Provider) {
  info('import command')
  const file = options.get('file')
  const read = await readFile(file, 'utf-8')
  const table = csv.toTable(read)
  await applyMiddlewares('input', table)
  await TagModel.resolveTags(table)
  await RowModel.upsertTable(table)
}
