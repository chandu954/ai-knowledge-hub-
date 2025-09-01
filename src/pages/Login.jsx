import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API_BASE } from '../lib/api'

export default function Login() {
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError('')
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({email,password})
    })
    const data = await res.json()
    if(!res.ok){ setError(data.error || 'Login failed'); return }
    localStorage.setItem('token', data.token)
    nav('/dashboard')
  }

  return (
    <div className="max-w-md mx-auto mt-12 card">
      <form onSubmit={submit} className="grid gap-3">
        <h2 className="text-xl font-bold">Welcome back</h2>
        {error && <div className="text-red-600">{error}</div>}
        <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn">Login</button>
        <p className="text-sm">New here? <Link className="underline" to="/register">Create an account</Link></p>
      </form>
    </div>
  )
}
