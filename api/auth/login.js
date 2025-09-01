import { connectDB } from '../_lib/db.js'
import User from '../_lib/models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  await connectDB()
  const { email, password } = req.body || {}
  const user = await User.findOne({ email })
  if(!user) return res.status(400).json({error:'Invalid credentials'})
  const ok = await bcrypt.compare(password, user.password)
  if(!ok) return res.status(400).json({error:'Invalid credentials'})
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:'7d' })
  res.json({ token })
}
