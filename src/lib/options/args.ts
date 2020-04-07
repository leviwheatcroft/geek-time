import yargs from 'yargs'

export const args = yargs
  .command(
    'import <file>',
    'import records from file'
  )
  .command(
    'export <file>',
    'export records to file'
  )
  .option('tags', {
    type: 'string',
    description: 'filter by tags, comma separated',
    coerce: (tags) => tags.split(',').map((t) => t.trim())
  })

