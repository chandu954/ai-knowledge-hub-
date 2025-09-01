import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_BASE, authHeaders } from '../lib/api'

export default function Dashboard() {
  const [docs, setDocs] = useState([])
  const [activity, setActivity] = useState([])

  useEffect(() => {
    fetch(`${API_BASE}/api/docs`, { headers: authHeaders() })
      .then(r=>r.json()).then(setDocs)
    fetch(`${API_BASE}/api/activity`, { headers: authHeaders() })
      .then(r=>r.json()).then(setActivity)
  }, [])

  return (
    <div className="grid md:grid-cols-[2fr,1fr] gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Documents</h2>
          <Link to="/edit"><button className="btn">Add Doc</button></Link>
        </div>
        <div className="grid gap-3">
          {docs.map(d => (
            <div key={d._id} className="card">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold">{d.title}</h3>
                <div className="flex gap-2">
                  <Link to={`/edit/${d._id}`}><button className="btn-secondary">Edit</button></Link>
                  <button className="btn-secondary" onClick={() => window.navigator.clipboard.writeText(d._id)}>Copy ID</button>
                </div>
              </div>
              <p className="mt-2 text-sm opacity-80">{d.summary || (d.content?.slice(0, 180) + (d.content?.length > 180 ? '…':''))}</p>
              <div className="mt-3 flex gap-2 flex-wrap">
                {(d.tags||[]).map(t => <span key={t} className="chip">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <aside className="space-y-3">
        <h3 className="text-lg font-semibold">Team Activity</h3>
        <div className="card">
          <ul className="space-y-2">
            {activity.map(a => (
              <li key={a._id} className="text-sm">
                <div className="opacity-70">{new Date(a.createdAt).toLocaleString()}</div>
                <div><b>{a.action}</b> — {a.detail}</div>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
