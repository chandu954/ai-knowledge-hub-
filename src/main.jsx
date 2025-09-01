import './index.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EditDoc from './pages/EditDoc.jsx'
import Search from './pages/Search.jsx'
import QA from './pages/QA.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="edit/:id?" element={<RequireAuth><EditDoc /></RequireAuth>} />
        <Route path="search" element={<RequireAuth><Search /></RequireAuth>} />
        <Route path="qa" element={<RequireAuth><QA /></RequireAuth>} />
      </Route>
    </Routes>
  </BrowserRouter>
)

function RequireAuth({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" />
  return children
}
