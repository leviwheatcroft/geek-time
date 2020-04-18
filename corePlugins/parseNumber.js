const numeral = require('numeral')

const name = 'parseNumber'

function serialise (ctx) {
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

function deserialise (ctx) {
  const {
    table,
    pluginOptions: {
      defaultFormat,
      formats
    },
    // log: {
    //   info
    // },
    is
  } = ctx
  table.forEach(({ data }) => {
    Object.entries(data).forEach(([key, value]) => {
      // numeral.js is a little overzealous
      if (
        // value is a mongo ObjectId
        (/^[a-f\d]{24}$/i.test(value)) ||
        // value is a tag
        (/^#/.test(value))
      )
        return
      const num = numeral(value)
      // info('num', {
      //   num,
      //   nan: is.nan(num)
      // })
      if (is.null(num.value()))
        return
      data[key] = num.format(formats[key] || defaultFormat)
    })
  })
}

const defaultOptions = {
  defaultFormat: '0,0[.]00',
  formats: {
    hours: '0,0.000',
    blocks: '0,0',
    rate: '$ 0,0.00',
    charge: '$ 0,0.00'
  }
}

function checkOptions () {
  return []
}

module.exports = {
  name,
  serialise,
  deserialise,
  defaultOptions,
  checkOptions
}
