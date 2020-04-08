import papa from 'papaparse'
import mongoose from 'mongoose'
import {
  RowModel
} from '@lib/db'
const {
  Types: { ObjectId }
} = mongoose

function toTable (csv: string): mongoose.Table {
  const parsed = papa.parse(csv, { header: true })
  const table = parsed.data.map((data) => {
    let rawRow: { [key: string]: any }
    if (data.id) {
      rawRow = {
        _id: new ObjectId(data.id),
        data
      }
      delete rawRow.data._id
    } else {
      rawRow = { data }
    }
    return new RowModel(rawRow)
  })
  return table
}

function fromTable (table: mongoose.Table): string {
  const rowData = table.map(({ data }) => data)

  return papa.unparse(rowData)
}

export default {
  toTable,
  fromTable
}