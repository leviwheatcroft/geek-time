import {
  isString
} from '@typeGuards'
import {
  verbose
} from '@lib/log'
import toMoment from 'moment'
import mongoose from 'mongoose'

const rowId: mongoose.PluginHandler = function rowId (
  ctx
) {
  const {
    table
  } = ctx
  verbose('table', table)
  table.forEach((row) => {
    row.data.id = row.id
  })
}

export const name = 'rowId'
export const output = rowId
