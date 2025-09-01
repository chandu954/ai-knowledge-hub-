import { connectDB } from '../../_lib/db.js'
import { requireAuth } from '../../_lib/auth.js'
import Document from '../../_lib/models/Document.js'
import Version from '../../_lib/models/Version.js'
import Activity from '../../_lib/models/Activity.js'
import { embed } from '../../_lib/gemini.js'

export default async function handler(req, res){
  const user = requireAuth(req, res); if(!user) return
  await connectDB()
  const { id } = req.query
  const doc = await Document.findById(id)
  if(!doc) return res.status(404).json({error:'Not found'})

  if(req.method === 'GET'){
    res.json(doc)
  } else if(req.method === 'PUT'){
    const { title=doc.title, content=doc.content, tags=doc.tags } = req.body || {}
    const versionCount = await Version.countDocuments({ docId: id })
    const embedding = await embed(`${title}\n\n${content}`)
    Object.assign(doc, { title, content, tags, embedding })
    await doc.save()
    await Version.create({ docId: id, version: versionCount + 1, title, content })
    await Activity.create({ action:'update', detail:`Doc "${title}" updated`, userId: user.id })
    res.json(doc)
  } else if(req.method === 'DELETE'){
    await doc.deleteOne()
    await Activity.create({ action:'delete', detail:`Doc "${doc.title}" deleted`, userId: user.id })
    res.json({ ok: true })
  } else {
    res.status(405).end()
  }
}
