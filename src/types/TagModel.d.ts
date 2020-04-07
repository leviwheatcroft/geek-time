declare module "mongoose" {
  export interface TagModel extends Model<TagDocument> {
    resolveTags: (table: Table) => Promise<void>
  }
}