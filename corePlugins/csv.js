const papa = require('papaparse')
const {
  promises: fsPromises
} = require('fs')

const {
  readFile,
  writeFile
} = fsPromises

const name = 'loadCsv'

async function importFile (ctx) {
  const {
    table,
    pluginOptions: { file }
  } = ctx

  const read = await readFile(file, 'utf-8')
  table.push(...toTable(read))
}

async function exportFile (ctx) {
  const {
    table,
    pluginOptions: { file }
  } = ctx
  const csv = papa.unparse(table.map((r) => r.data))
  await writeFile(file, csv)
}

function toTable (csv) {
  const parsed = papa.parse(csv, { header: true })
  const table = parsed.data
    // discard empty rows
    .filter((data) => {
      // eslint-disable-next-line eqeqeq
      if (Object.values(data).every((v) => v == false))
        return false
      return true
    })
    .map((data) => {
      let rawRow
      if (data.id) {
        rawRow = {
          _id: data.id,
          data,
          meta: {}
        }
        delete rawRow.data._id
      } else {
        rawRow = {
          data,
          meta: {}
        }
      }
      return rawRow
    })
  return table
}

// eslint-disable-next-line no-unused-vars
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
  importFile,
  exportFile,
  defaultOptions,
  checkOptions
}
