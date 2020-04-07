declare module "mongoose" {
  export interface TagDocument extends Document {
    name: string
  }
}