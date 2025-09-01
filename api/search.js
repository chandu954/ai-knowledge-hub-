import { connectDB } from './_lib/db.js'
import { requireAuth } from './_lib/auth.js'
import Document from './_lib/models/Document.js'
import { embed } from './_lib/gemini.js'

function cosine(a,b){
  if(!a?.length || !b?.length) return 0
  let dot=0, na=0, nb=0
  const n = Math.min(a.length, b.length)
  for(let i=0;i<n;i++){ dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i] }
  return dot / (Math.sqrt(na)*Math.sqrt(nb) || 1)
}

export default async function handler(req, res){
  const user = requireAuth(req, res); if(!user) return
  await connectDB()
  const q = (req.query.q || '').trim()
  if(!q) return res.json([])

  const [qvec, docs] = await Promise.all([
    embed(q),
    Document.find().limit(200)
  ])
  const scored = docs.map(d => ({ ...d.toObject(), _score: cosine(qvec, d.embedding) }))
    .sort((a,b) => b._score - a._score)
    .slice(0, 20)
  res.json(scored)
}
