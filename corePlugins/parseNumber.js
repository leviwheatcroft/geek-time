const name = 'parseNumber'

function middleware (ctx) {
  const {
    table,
    is
  } = ctx
  table.forEach(({ data }) => {
    Object.entries(data).forEach(([key, value]) => {
      if (value === '')
        return
      const number = Number(value)
      if (is.nan(number))
        return
      data[key] = number
    })
  })
}

const defaultOptions = {}

function checkOptions () {
  return []
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
