declare module "mongoose" {
  export interface RowModel extends Model<RowDocument> {
    upsertTable: (table: Table) => Promise<void>
    rowToRowDocument: (row: Row) => RowDocument
    rowDocumentToRow: (row: RowDocument) => Row
  }
}