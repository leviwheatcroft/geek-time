import { info, verbose } from "@lib/log"
import nconf from 'nconf'
import {
  promises as fsPromises
} from 'fs'
import {
  csv
} from '@lib/transformers'
import {
  isTable
} from '@typeGuards'
import {
  applyPlugins
} from '@lib/plugins'
import asyncPool from 'tiny-async-pool'
import {
  TagModel,
  RowModel
} from "@lib/db"

const {
  writeFile
} = fsPromises

export async function exportCommand (options: nconf.Provider) {
  info('export command')
  const tags = options.get('tags')
  const tagIds = await TagModel.find(
    {
      name: { $in: tags }
    },
    '_id',
    {
      lean: true
    }
  ) as Array<{ _id: string }>
  let table = await RowModel.find(
    {
      'meta.tags': { $in: tagIds }
    },
    null,
    {
      lean: true
    }
  )
  verbose('got results', table)
  applyPlugins('output', table)
  info('export result')
  info(table)
  const file = options.get('file')
  await writeFile(file, csv.fromTable(table))

}
