interface Options {
  [key: string]: any
  plugins: { [key: string]: PluginDefinition }
  get: (key: string) => any
  set: (key: string, value: any) => void
}