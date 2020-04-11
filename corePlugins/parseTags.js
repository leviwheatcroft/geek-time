const name = 'parseTags'

function middleware (ctx) {
  const {
    table,
    pluginOptions: {
      autoSingleTag,
      autoMultiTag,
      include,
      exclude
    }
  } = ctx
  table.forEach(({ data, meta }) => {
    let tagNames = []
    Object.entries(data).forEach(([key, value]) => {
      if (
        (include.length) &&
        (!include.includes(key))
      ) return
      if (exclude.includes(key)) return
      if (!isString(value)) return

      if (autoSingleTag.includes(key)) {
        value = value.replace(/\s/, '-')
        if (!value.startsWith('#'))
          value = `#${value}`
        tagNames.push(value)
        return
      }
      if (autoMultiTag.includes(key)) {
        value = value.split(/\s/).map((v) => {
          return v.startsWith('#') ? value : `#${value}`
        })
        tagNames = tagNames.concat(value)
        return
      }
      tagNames = tagNames.concat(value.match(/#[^\s]*/g))
    })
    tagNames = tagNames.filter((tag, i, self) => {
      if (tag === null) return false
      if (self.indexOf(tag) === i) return true
    })
    meta.tagNames = tagNames
  })
  
}

const defaultOptions = {
  autoSingleTag: [],
  autoMultiTag: [],
  include: [],
  exclude: []
}
function checkOptions () {
  const {
    autoSingleTag,
    autoMultiTag,
    include,
    exclude
  } = options
  const errors = []
  if (
    (!is.array(autoSingleTag)) ||
    (!is.all.string(...autoSingleTag))
  ) errors.push('autoSingleTag must be array of strings')
  if (
    (!is.array(autoMultiTag)) ||
    (!is.all.string(...autoMultiTag))
  ) errors.push('autoMultiTag must be array of strings')
  if (
    (!is.array(include)) ||
    (!is.all.string(...include))
  ) errors.push('include must be array of strings')
  if (
    (!is.array(exclude)) ||
    (!is.all.string(...exclude))
  ) errors.push('exclude must be array of strings')

  return errors
}