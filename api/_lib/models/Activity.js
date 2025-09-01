import mongoose from 'mongoose'
const ActivitySchema = new mongoose.Schema({
  action: String,
  detail: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true })
export default mongoose.models.Activity || mongoose.model('Activity', ActivitySchema)
