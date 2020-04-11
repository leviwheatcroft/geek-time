declare module "mongoose" {
  type Middleware = (ctx: Context) => Promise<void> | void
}