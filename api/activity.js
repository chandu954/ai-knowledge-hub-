import { connectDB } from './_lib/db.js'
import { requireAuth } from './_lib/auth.js'
import Activity from './_lib/models/Activity.js'

export default async function handler(req, res){
  const user = requireAuth(req, res); if(!user) return
  await connectDB()
  const items = await Activity.find().sort({ createdAt: -1 }).limit(5)
  res.json(items)
}
