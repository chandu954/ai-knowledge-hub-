  const BASE = 'https://generativelanguage.googleapis.com/v1beta'

  export async function generateSummaryAndTags({ title, content, model = process.env.GEMINI_MODEL || 'models/gemini-1.5-flash' }){
    const key = process.env.GEMINI_API_KEY
    const prompt = `Summarize the following document in 3-5 sentences and propose 5-8 short tags.
Title: ${title}
Content:
${content}
Return JSON with fields: summary (string), tags (string[]).`
    const url = `${BASE}/${encodeURIComponent(model)}:generateContent?key=${key}`
    const body = {
      contents: [{ role:'user', parts:[{text: prompt}]}]
    }
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    const data = await r.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    try{
      const obj = JSON.parse(text)
      return { summary: obj.summary || '', tags: obj.tags || [] }
    }catch{
      // fallback: simple heuristics
      return { summary: text.slice(0, 600), tags: [] }
    }
  }

  export async function embed(text, { model = process.env.GEMINI_EMBED_MODEL || 'models/text-embedding-004' } = {}){
    const key = process.env.GEMINI_API_KEY
    const url = `${BASE}/${encodeURIComponent(model)}:embedContent?key=${key}`
    const body = { content: { parts:[{ text }] } }
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    const data = await r.json()
    const v = data?.embedding?.values || data?.data?.[0]?.embedding
    return v || []
  }

  export async function answerWithContext(question, docs, { model = process.env.GEMINI_MODEL || 'models/gemini-1.5-flash' } = {}){
    const key = process.env.GEMINI_API_KEY
    const context = docs.map((d,i)=>`[Doc ${i+1}] Title: ${d.title}\nContent: ${d.content}`).join('\n\n')
    const prompt = `You are answering strictly using the provided documents. If unsure, say you don't know.
Question: ${question}
Documents:
${context}`
    const url = `${BASE}/${encodeURIComponent(model)}:generateContent?key=${key}`
    const body = { contents: [{ role:'user', parts:[{text: prompt}]}] }
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    const data = await r.json()
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return text
  }
