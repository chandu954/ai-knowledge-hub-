import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function App() {
  const nav = useNavigate()
  const token = localStorage.getItem('token')

  function logout() {
    localStorage.removeItem('token')
    nav('/login')
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400" />
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Knowledge Hub</h1>
        </div>
        <nav className="flex gap-2">
          <Link className="btn-secondary" to="/dashboard">Dashboard</Link>
          <Link className="btn-secondary" to="/edit">Add Doc</Link>
          <Link className="btn-secondary" to="/search">Search</Link>
          <Link className="btn-secondary" to="/qa">Team Q&A</Link>
          {!token ? <Link className="btn" to="/login">Login</Link> : <button className="btn" onClick={logout}>Logout</button>}
        </nav>
      </header>
      <Outlet />
    </div>
  )
}
