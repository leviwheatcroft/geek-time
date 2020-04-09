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

let loggerResolve: any
let loggerReject: any
export let logger: Promise<Logger> = new Promise((resolve, reject) => {
  loggerResolve = resolve
  loggerReject = reject
})

export function initialiseLog () {
  const {
    LOG_LEVEL_CONSOLE: logLevelConsole = 'info',
    LOG_LEVEL_FILE: logLevelFile = 'info'
  } = process.env
  const _logger = createLogger({
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
                      _logger.error('couldn\'t convert field', { field })
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

  _logger.info('log started')
  loggerResolve(_logger)
}

export function error (message: string, meta?: { [key: string]: any }) {
  logger.then((logger) => logger.error(message, meta))
}
export function warn (message: string, meta?: { [key: string]: any }) {
  logger.then((logger) => logger.warn(message, meta))
}
export function info (message: string, meta?: { [key: string]: any }) {
  logger.then((logger) => logger.info(message, meta))
}
export function verbose (message: string, meta?: { [key: string]: any }) {
  logger.then((logger) => logger.verbose(message, meta))
}
export function debug (message: string, meta?: { [key: string]: any }) {
  logger.then((logger) => logger.debug(message, meta))
}
export function silly (message: string, meta?: { [key: string]: any }) {
  logger.then((logger) => logger.silly(message, meta))
}
