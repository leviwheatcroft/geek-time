const papa = require('papaparse')
const {
  promises: fsPromises
} = require('fs')
const {
  readFile
} = fsPromises

const name = 'loadCsv'

async function middleware (ctx) {
  const {
    table,
    pluginOptions: { file }
  } = ctx

  const read = await readFile(file, 'utf-8')
  table.push(...toTable(read))
}

function toTable (csv) {
  const parsed = papa.parse(csv, { header: true })
  const table = parsed.data.map((data) => {
    let rawRow
    if (data.id) {
      rawRow = {
        _id: new ObjectId(data.id),
        data,
        meta: []
      }
      delete rawRow.data._id
    } else {
      rawRow = {
        data,
        meta: []
      }
    }
    return rawRow
  })
  return table
}

function fromTable (table) {
  const rowData = table.map(({ data }) => data)

  return papa.unparse(rowData)
}

const defaultOptions = {
  file: ''
}

function checkOptions (ctx) {
  const {
    pluginOptions: { file },
    is
  } = ctx
  const errors = []
  if (!file)
    errors.push('\'file\' option is required')
  if (!is.string(file))
    errors.push('\'file\' option must be a string')
  return errors
}

module.exports = {
  name,
  middleware,
  defaultOptions,
  checkOptions
}
