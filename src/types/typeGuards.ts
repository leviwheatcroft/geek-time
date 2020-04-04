import {
  is
} from 'typescript-is'

export function isString (value: any): value is string {
  return typeof value === 'string'
}
export function isTable (value: any): value is Table {
  // TODO:
  // typescript-is complaining about classes?!
  // if (is<Table>(value)) return true
  // throws an error about classes
  if (Array.isArray(value)) return true
}
export function isMiddleware (value: any): value is Middleware {
  if (is<Middleware>(value)) return true
}