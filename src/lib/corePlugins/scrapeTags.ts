import {
  isString
} from '@typeGuards'

const scrapeTags: MiddlewareHandler = function scrapeTags (
  ctx
) {
  const {
    table
  } = ctx
  table.forEach(({ data, meta }) => {
    let tagNames = []
    Object.entries(data).forEach(([key, value]) => {
      if (!isString(value)) return
      tagNames = tagNames.concat(value.match(/#[^\s]*/g))
    })
    tagNames = tagNames.filter((tag, i, self) => {
      if (tag === null) return false
      if (self.indexOf(tag) === i) return true
    })
    meta.tagNames = tagNames
  })
}

export const name = 'scrapeTags'
export const input = scrapeTags