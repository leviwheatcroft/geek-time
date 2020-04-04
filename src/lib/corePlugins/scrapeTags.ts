import {
  isString
} from '@typeGuards'

const scrapeTags: MiddlewareHandler = function scrapeTags (
  ctx
) {
  const {
    table,
    meta,
    options,
    log: {
      verbose
    }
  } = ctx
  table.forEach((row) => {
    let tags = []
    Object.keys(row).forEach((column) => {
      const field = row[column]
      if (!isString(field)) return
      tags = tags.concat(field.match(/#\w*/g))
      row._tags = tags.filter((tag, i, self) => {
        if (tag === null) return false
        if (self.indexOf(tag) === i) return true
      })
    })
  })
}

export const name = 'scrapeTags'
export const input = scrapeTags