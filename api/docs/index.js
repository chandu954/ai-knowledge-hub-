import { connectDB } from '../_lib/db.js'
import { requireAuth } from '../_lib/auth.js'
import Document from '../_lib/models/Document.js'
import Version from '../_lib/models/Version.js'
import Activity from '../_lib/models/Activity.js'
import { embed } from '../_lib/gemini.js'

export default async function handler(req, res){
  const user = requireAuth(req, res); if(!user) return
  await connectDB()
  if(req.method === 'GET'){
    const items = await Document.find().sort({ updatedAt: -1 }).limit(100)
    res.json(items)
  } else if (req.method === 'POST'){
    const { title, content, tags=[] } = req.body || {}
    const embedding = await embed(`${title}\n\n${content}`)
    const doc = await Document.create({ title, content, tags, createdBy: user.id, embedding })
    await Version.create({ docId: doc._id, version: 1, title, content })
    await Activity.create({ action:'create', detail:`Doc "${title}" created`, userId: user.id })
    res.status(201).json(doc)
  } else {
    res.status(405).end()
  }
}
