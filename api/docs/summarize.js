import { requireAuth } from '../_lib/auth.js'
import { generateSummaryAndTags } from '../_lib/gemini.js'

export default async function handler(req, res){
  const user = requireAuth(req, res); if(!user) return
  if(req.method !== 'POST') return res.status(405).end()
  const { title, content } = req.body || {}
  try{
    const { summary, tags } = await generateSummaryAndTags({ title, content })
    res.json({ content: `${content}\n\n---\nSummary:\n${summary}`, tags })
  }catch(e){
    res.status(500).json({ error: e.message })
  }
}
