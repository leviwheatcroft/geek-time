// const debug = require('debug')

// const dbg = debug('gt')

const name = 'groupTags'

function middleware (ctx) {
  const {
    table,
    pluginOptions: {
      mode,
      sumColumns
    }
  } = ctx
  const _sumColumns = sumColumns ? sumColumns.split(',') : []
  const tags = {}
  switch (mode) {
    case 'list':
      table.forEach((row) => {
        row.meta.tagNames.forEach((tagName) => {
          if (!tags[tagName]) {
            const tag = {
              data: {
                tag: tagName
              },
              meta: {}
            }
            const initialColumns = _sumColumns.map((column) => [column, 0])
            if (_sumColumns.length)
              Object.assign(tag.data, Object.fromEntries(initialColumns))
            tags[tagName] = tag
          }
          _sumColumns.forEach((column) => {
            tags[tagName].data[column] += row.data[column]
          })
        })
      })
      break
    default:
      throw new Error('bad mode')
  }
  ctx.table = Object.values(tags)
}

const defaultOptions = {
  mode: 'list',
  sumColumns: ''
}

function checkOptions (ctx) {
  const {
    pluginOptions: {
      mode,
      sumColumns
    },
    is
  } = ctx
  const errors = []
  if (!is.string(mode))
    errors.push('mode must be a string')
  if (
    mode !== 'list'
  )
    errors.push(`${mode} is not a valid mode`)
  if (!is.string(sumColumns))
    errors.push('sumColumns must be a string, comma separated')
  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
