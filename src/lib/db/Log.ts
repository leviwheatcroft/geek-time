import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const logSchema = new mongoose.Schema(
  {
    timestamp: Date,
    level: String,
    message: String,
    meta: mongoose.Schema.Types.Mixed
  }
)

logSchema.plugin(paginate)

export const LogModel = mongoose.model('Log', logSchema) as mongoose.LogModel
