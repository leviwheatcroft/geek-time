declare module "mongoose" {
  interface Plugin {
    name: string
    middleware: Middleware
    defaultOptions: {
      [key: string]: any
    },
    checkOptions: (options: any) => Array<string>
  }
}