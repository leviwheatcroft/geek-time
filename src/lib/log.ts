import {
  createLogger,
  format,
  transports,
  Logger
} from 'winston'
import 'winston-daily-rotate-file'

import {
  inspect
} from 'util'
import PrettyTable from 'prettytable'
import {
  isString
} from '@typeGuards'

const {
  LOG_LEVEL_CONSOLE: logLevelConsole = 'info',
  LOG_LEVEL_FILE: logLevelFile = 'info'
} = process.env
const logger = createLogger({
  format: format.combine(
    format.errors({ stack: true }),
    format.metadata({ fillExcept: ['hideMeta', 'level', 'message'] }),
    format.json()
  ),
  transports: [
    new transports.Console({
      level: 'silly',
      silent: logLevelConsole === 'off',
      format: format.printf(({ level, metadata, message }) => {
        const inspectOptions = {
          colors: true,
          compact: false
        }
        const formatted = [
          `[${level}]: ${message}`
        ]

        if (metadata.table) {
          const pt = new PrettyTable()
          const headings = [
            ...Object.keys(metadata.table[0].data),
            ...Object.keys(metadata.table[0].meta).map((k) => `_${k}`)
          ]
          const table = [
            headings,
            [
              ...metadata.table.map(({ data, meta }) => {
                data = Object.assign({}, data)
                Object.entries(meta).forEach(([k, v]) => {
                  data[`_${k}`] = v
                })
                const item = Object.values(data).map((field: any) => {
                  if (field instanceof Date) field = field.toString()
                  if (Array.isArray(field)) field = field.join(', ')
                  if (
                    (field === undefined) ||
                    (field === null)
                  ) field = ''
                  if (!isString(field)) {
                    logger.error('couldn\'t convert field', { field })
                    throw new RangeError()
                  }
                  return field.slice(0, 20)
                })
                return item
              })
            ]
          ]
          pt.create(table.shift(), ...table)
          delete metadata.table
          formatted.push(`${pt.toString().trimEnd()}`)
        }
        if (Object.keys(metadata).length) {
          formatted.push(`${inspect(metadata, inspectOptions)}`)
        }
        return formatted.join('\n')
      })
    }),
    new transports.DailyRotateFile({
      silent: logLevelFile === 'off',
      level: logLevelFile === 'off' ? 'error' : logLevelFile,
      filename: 'geektime-%DATE%.log',
      maxSize: '20m',
      maxFiles: '14d',
      dirname: 'logs',
      createSymlink: true,
      symlinkName: 'geektime.log'
    })
  ]
})

export const error = logger.error.bind(logger)
export const warn = logger.warn.bind(logger)
export const info = logger.info.bind(logger)
export const verbose = logger.verbose.bind(logger)
export const debug = logger.debug.bind(logger)
export const silly = logger.silly.bind(logger)