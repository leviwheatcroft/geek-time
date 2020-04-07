import papa from 'papaparse'
import mongoose from 'mongoose'
import {
  RowModel
} from '@lib/db'

function toTable (csv: string): mongoose.Table {
  const parsed = papa.parse(csv, { header: true })
  const table = parsed.data.map((data) => new RowModel({ data }))
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