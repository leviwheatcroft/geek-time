const name = 'parseTags'

function middleware (ctx) {
  const {
    table,
    pluginOptions: {
      autoSingleTag,
      autoMultiTag,
      include,
      exclude
    },
    is
  } = ctx
  table.forEach(({ data, meta }) => {
    let tagNames = []
    Object.entries(data).forEach(([key, value]) => {
      if (
        (include.length) &&
        (!include.includes(key))
      )
        return
      if (exclude.includes(key))
        return
      if (!is.string(value))
        return

      if (autoSingleTag.includes(key)) {
        let _value = value
        _value = _value.replace(/\s/, '-')
        if (!value.startsWith('#'))
          _value = `#${_value}`
        tagNames.push(_value)
        return
      }
      if (autoMultiTag.includes(key)) {
        let _value = value
        // eslint-disable-next-line arrow-body-style
        _value = _value.split(/\s/).map((v) => {
          return v.startsWith('#') ? _value : `#${_value}`
        })
        tagNames = tagNames.concat(_value)
        return
      }
      tagNames = tagNames.concat(value.match(/#[^\s]*/g))
    })
    tagNames = tagNames.filter((tag, i, self) => {
      if (tag === null)
        return false
      if (self.indexOf(tag) === i)
        return true
      return false
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
function checkOptions (ctx) {
  const {
    pluginOptions: {
      autoSingleTag,
      autoMultiTag,
      include,
      exclude
    },
    is
  } = ctx

  const errors = []
  if (
    (!is.array(autoSingleTag)) ||
    (!is.all.string(...autoSingleTag))
  )
    errors.push('autoSingleTag must be array of strings')
  if (
    (!is.array(autoMultiTag)) ||
    (!is.all.string(...autoMultiTag))
  )
    errors.push('autoMultiTag must be array of strings')
  if (
    (!is.array(include)) ||
    (!is.all.string(...include))
  )
    errors.push('include must be array of strings')
  if (
    (!is.array(exclude)) ||
    (!is.all.string(...exclude))
  )
    errors.push('exclude must be array of strings')

  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
