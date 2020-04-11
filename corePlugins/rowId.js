const name = 'rowId'

function middleware (ctx) {
  const {
    table,
    pluginOptions: { include }
  } = ctx
  if (!include) return
  table.forEach((row) => {
    row.data.id = row.id
  })
}

const defaultOptions = {
  include: true
}

function checkOptions (ctx) {
  const {
    pluginOptions: { include },
    is
  } = options
  const errors = []
  if (!is.boolean(include))
    errors.push('include must be true or false')
  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
