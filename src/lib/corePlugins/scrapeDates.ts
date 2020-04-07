import {
  isString
} from '@typeGuards'
import {
  verbose
} from '@lib/log'
import toMoment from 'moment'

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
  table.forEach(({ data, meta }) => {
    Object.entries(data).forEach(([key, value]) => {
      if (!isString(value)) return
      let moment: toMoment.Moment
      const isDateString = formats.some((format) => {
        moment = toMoment(value, format)
        return moment.isValid()
      })
      if (!isDateString) return
      const date = moment.toDate()
      data[key] = date
      if (!meta.date) meta.date = date
    })
  })
}

export const name = 'scrapeDates'
export const input = scrapeDates
