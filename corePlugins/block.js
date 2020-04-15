const jexl = require('jexl')
// const debug = require('debug')

// const dbg = debug('gt')

const name = 'block'

function middleware (ctx) {
  const {
    table,
    pluginOptions: {
      blocks,
      sumColumns
    },
    log: {
      error
    }
  } = ctx
  const _blocks = Object.fromEntries(blocks.map((b) => [b.title, []]))
  table.forEach((row) => {
    const matched = blocks.some(({ title, condition }) => {
      if (!jexl.evalSync(condition, row))
        return false
      return _blocks[title].push(row)
    })
    if (!matched) {
      error('Row did not match any block:', { row })
      throw new Error('[block] unmatched row')
    }
  })
  Object.entries(_blocks).forEach(([title, rows]) => {
    const firstColumn = Object.keys(rows[0].data)[0]

    // add heading to block
    const heading = {
      data: {
        [firstColumn]: title
      },
      meta: {}
    }
    rows.unshift(heading)

    // add totals to block
    if (sumColumns.length) {
      const totals = {
        data: {
          ...Object.fromEntries(sumColumns.map((c) => [c, 0]))
        },
        meta: []
      }
      rows.forEach((row) => {
        sumColumns.forEach((sumColumn) => {
          totals.data[sumColumn] += row.data[sumColumn]
        })
      })
      totals.data[firstColumn] = `Total ${title}`
      rows.push(totals)
    }

    // add gap after block
    rows.push({ data: {}, meta: {} })
  })

  ctx.table = Object.values(_blocks).flat()
}

const defaultOptions = {
  blocks: [],
  sumColumns: []
}

function checkOptions (ctx) {
  const {
    pluginOptions: {
      blocks,
      sumColumns
    },
    is
  } = ctx
  const errors = []
  if (!is.array(blocks))
    errors.push('\'blocks\' - must be an array')
  if (!blocks.length)
    errors.push('\'blocks\' - at least one block must be defined')
  if (!is.array(sumColumns))
    errors.push('\'sumColumns\' - must be an array')
  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
