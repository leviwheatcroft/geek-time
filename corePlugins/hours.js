// const jexl = require('jexl')
// const debug = require('debug')

// const dbg = debug('gt')

const name = 'hours'

function middleware (ctx) {
  const {
    table,
    pluginOptions: {
      minutesPerBlock
    }
    // log: {
    //   error,
    //   debug
    // },
    // is
  } = ctx
  table.forEach(({ data }) => {
    data.hours = 60 / (data.blocks * minutesPerBlock)
  })
}

const defaultOptions = {
  minutesPerBlock: 5
}

function checkOptions (ctx) {
  const {
    pluginOptions: {
      minutesPerBlock
    },
    is
  } = ctx
  const errors = []
  if (!is.integer(minutesPerBlock))
    errors.push('\'minutesPerBlock\' must be an integer')
  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
