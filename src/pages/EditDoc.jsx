import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { API_BASE, authHeaders } from '../lib/api'

export default function EditDoc() {
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (!id) return
    fetch(`${API_BASE}/api/docs/${id}`, { headers: authHeaders() })
      .then(r=>r.json()).then(d => {
        setTitle(d.title || '')
        setContent(d.content || '')
        setTags((d.tags||[]).join(','))
      })
  }, [id])

  async function save(e){
    e.preventDefault()
    setLoading(true)
    const body = { title, content, tags: tags.split(',').map(s=>s.trim()).filter(Boolean) }
    const res = await fetch(`${API_BASE}/api/docs${id?'/'+id:''}`, {
      method: id ? 'PUT':'POST', headers: authHeaders(), body: JSON.stringify(body)
    })
    setLoading(false)
    if(res.ok) nav('/dashboard')
    else alert('Error saving')
  }

  async function summarize(){
    const res = await fetch(`${API_BASE}/api/docs/summarize`, {
      method:'POST', headers: authHeaders(), body: JSON.stringify({ title, content })
    })
    const data = await res.json()
    if(res.ok){ setContent(data.content); alert('Summary added to content; tags will save on next Save.') }
    else alert(data.error || 'Failed to summarize')
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-3">
      <h2 className="text-xl font-bold">{id ? 'Edit Doc':'Add Doc'}</h2>
      <input className="input" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea className="input min-h-[320px]" placeholder="Content (markdown/plain)" value={content} onChange={e=>setContent(e.target.value)} required />
      <input className="input" placeholder="Tags (comma-separated)" value={tags} onChange={e=>setTags(e.target.value)} />
      <div className="flex gap-2">
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...':'Save'}</button>
        <button type="button" className="btn-secondary" onClick={summarize}>Summarize with Gemini</button>
      </div>
    </form>
  )
}
