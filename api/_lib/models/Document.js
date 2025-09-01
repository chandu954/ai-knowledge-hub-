import mongoose from 'mongoose'
const DocSchema = new mongoose.Schema({
  title: String,
  content: String,
  summary: String,
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  embedding: { type: [Number], index: false }
}, { timestamps: true })
export default mongoose.models.Document || mongoose.model('Document', DocSchema)
