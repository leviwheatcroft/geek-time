import yargs from 'yargs'
import {
  readFileSync
} from 'fs'
import {
  importData
} from '@lib/importData'
import {
  isString
} from '@typeGuards'
import {
  importCommand
} from '../../cli/commands/import'

export const args = yargs
  .command(
    'import <file>',
    'import records from file',
    // (argv) => {
    //   argv.positional('file', {
    //     describe: 'file to import data from',
    //     type: 'string'
    //   })
    // }
  )

