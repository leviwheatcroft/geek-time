interface Middleware {
  name: string
  input?: MiddlewareHandler
  output?: MiddlewareHandler
}