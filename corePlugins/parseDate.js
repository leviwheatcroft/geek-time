const toMoment = require('moment')

const name = 'parseDate'

const formats = [
  'YYYY-MM-DD',
  'DD/MM/YY',
  'DD-MM-YY',
  'DD/MM/YYYY',
  'DD-MM-YYYY'
]

function middleware (ctx) {
  const {
    table,
    pluginOptions: { include },
    is
  } = ctx
  table.forEach(({ data, meta }) => {
    let date
    Object.entries(data).some(([key, value]) => {
      if (
        (include !== true) &&
        (!include.includes(key))
      )
        return false
      if (!is.string(value))
        return false
      let moment
      const isDateString = formats.some((format) => {
        moment = toMoment(value, format)
        return moment.isValid()
      })
      if (!isDateString)
        return false
      date = moment.toDate()
      return true
    })
    meta.date = date
  })
}

const defaultOptions = {
  include: true
}

function checkOptions (ctx) {
  const {
    pluginOptions: { include }
  } = ctx
  const errors = []
  if (
    (include !== true) &&
    (!Array.isArray(include))
  )
    errors.push('include must be either true, or array of column names')
  if (Array.isArray(include)) {
    const allStrings = include.every((v) => typeof v === 'string')
    if (!allStrings)
      errors.push('all column elements must be strings')
  }
  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
