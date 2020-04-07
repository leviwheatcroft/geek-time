import debug from 'debug'
// import {
//   options
// } from '@lib/options'
import {
  isTable
} from '@typeGuards'
import PrettyTable from 'prettytable'
import { isString } from 'util'
// const logLevel = options.get('logLevel')

const levels = [
  'silly',
  'verbose',
  'info',
  'warn',
  'error'
]

// levels.slice(levels.indexOf(logLevel)).forEach((l) => {
//   debug.enable(`gt:${l}`)
// })

const base = debug('gt')

const dbg = Object.fromEntries(levels.map((l) => {
  return [l, base.extend(l)]
}))

const log = Object.fromEntries(levels.map((l) => {
  return [
    l,
    (initial: any, ...rest: any) => {
      if (!dbg[l].enabled) return
      if (
        (rest.length !== 0) ||
        (!isTable(initial))
      ) return dbg[l](initial, ...rest)

      const pt = new PrettyTable()
      const table = [
        Object.keys(initial[0].data),
        [
          ...initial.map(({ data }) => {
            const item = Object.values(data).map((field) => {

              if (field instanceof Date) field = field.toString()
              if (Array.isArray(field)) field = field.join(', ')
              if (!isString(field)) {
                error(field)
                throw new RangeError()
              }
              return field.slice(0, 20)
            })
            return item
          })
        ]
      ]
      pt.create(table.shift(), ...table)
      pt.print()
    }
  ]
}))

export const silly = log.silly
export const verbose = log.verbose
export const info = log.info
export const warn = log.warn
export const error = log.error