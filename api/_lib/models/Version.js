import mongoose from 'mongoose'
const VersionSchema = new mongoose.Schema({
  docId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  version: Number,
  title: String,
  content: String
}, { timestamps: true })
export default mongoose.models.Version || mongoose.model('Version', VersionSchema)
