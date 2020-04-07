declare module "mongoose" {
  interface Plugin {
    name: string
    input?: PluginHandler
    output?: PluginHandler
  }
}