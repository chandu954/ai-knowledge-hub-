import React, { useState } from 'react'
import { API_BASE, authHeaders } from '../lib/api'

export default function QA(){
  const [q,setQ]=useState('')
  const [answer,setAnswer]=useState('')
  const [loading,setLoading]=useState(false)

  async function ask(){
    setLoading(true)
    const res=await fetch(`${API_BASE}/api/qa`, { method:'POST', headers: authHeaders(), body: JSON.stringify({ question: q }) })
    const data=await res.json()
    setLoading(false)
    if(res.ok) setAnswer(data.answer)
    else setAnswer(data.error || 'Failed')
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Team Q&A</h2>
      <textarea rows={4} className="input w-full mt-2" placeholder="Ask a question to your team's knowledge base…" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="mt-2">
        <button className="btn" onClick={ask} disabled={loading}>{loading ? 'Asking…':'Ask Gemini'}</button>
      </div>
      {answer && <div className="card mt-4 whitespace-pre-wrap">{answer}</div>}
    </div>
  )
}
