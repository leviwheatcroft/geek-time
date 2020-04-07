declare module "mongoose" {
  export interface RowDocument extends Document {
    meta: {
      date?: Date,
      tagNames?: Array<string>,
      tags?: Array<TagDocument>
    },
    data: {
      [key: string]: any
    },
    upsert: () => Promise<void>
  }
}