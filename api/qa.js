import { connectDB } from './_lib/db.js'
import { requireAuth } from './_lib/auth.js'
import Document from './_lib/models/Document.js'
import { embed, answerWithContext } from './_lib/gemini.js'

function cosine(a,b){
  if(!a?.length || !b?.length) return 0
  let dot=0, na=0, nb=0
  const n = Math.min(a.length, b.length)
  for(let i=0;i<n;i++){ dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i] }
  return dot / (Math.sqrt(na)*Math.sqrt(nb) || 1)
}

export default async function handler(req, res){
  const user = requireAuth(req, res); if(!user) return
  if(req.method !== 'POST') return res.status(405).end()
  await connectDB()
  const { question } = req.body || {}
  if(!question) return res.status(400).json({error:'question required'})
  const qvec = await embed(question)
  const docs = await Document.find().limit(200)
  const top = docs.map(d => ({ d, s: cosine(qvec, d.embedding) }))
    .sort((a,b)=>b.s-a.s).slice(0,5).map(x=>x.d)
  const answer = await answerWithContext(question, top)
  res.json({ answer })
}
