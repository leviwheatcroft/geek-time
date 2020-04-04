import {
  isString
} from '@typeGuards'
import {
  verbose
} from '@lib/log'
import moment from 'moment'

const formats = [
  'YYYY-MM-DD',
  'DD/MM/YY',
  'DD-MM-YY',
  'DD/MM/YYYY',
  'DD-MM-YYYY'
]
const scrapeDates: MiddlewareHandler = function scrapeDates (
  ctx
) {
  const {
    table
  } = ctx
  table.forEach((row) => {
    let tags = []
    Object.keys(row).forEach((column) => {
      const field = row[column]
      if (!isString(field)) return
      let asMoment: moment.Moment
      const isDateString = formats.some((format) => {
        asMoment = moment(field, format)
        return asMoment.isValid()
      })
      if (!isDateString) return
      const asDate = asMoment.toDate()
      row[column] = asDate
      if (!row._date) row._date = asDate
    })
  })
}

export const name = 'scrapeDates'
export const input = scrapeDates
