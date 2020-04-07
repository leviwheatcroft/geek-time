declare module "mongoose" {
  type PluginHandler = (ctx: Context) => Promise<void> | void
}