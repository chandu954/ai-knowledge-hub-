import React, { useState } from 'react'
import { API_BASE, authHeaders } from '../lib/api'

export default function Search(){
  const [q,setQ]=useState('')
  const [results,setResults]=useState([])

  async function run(){
    const res=await fetch(`${API_BASE}/api/search?q=`+encodeURIComponent(q), { headers: authHeaders() })
    setResults(await res.json())
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Search</h2>
      <div className="flex gap-2 mt-2">
        <input className="input flex-1" placeholder="Search text…" value={q} onChange={e=>setQ(e.target.value)} />
        <button className="btn" onClick={run}>Search</button>
      </div>
      <div className="grid gap-3 mt-4">
        {results.map(r => (
          <div key={r._id} className="card">
            <h3 className="text-lg font-semibold">{r.title} <small className="opacity-60">score: {r._score?.toFixed(3)}</small></h3>
            <p className="text-sm mt-1 opacity-80">{r.summary || r.content?.slice(0,160)}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {(r.tags||[]).map(t => <span key={t} className="chip">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
