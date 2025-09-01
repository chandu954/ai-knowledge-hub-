import { connectDB } from '../_lib/db.js'
import User from '../_lib/models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  try{
    await connectDB()
    const { email, password, role='user' } = req.body || {}
    if(!email || !password) return res.status(400).json({error:'email & password required'})
    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hash, role })
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn:'7d' })
    res.status(201).json({ token })
  }catch(e){
    res.status(400).json({ error: e.message })
  }
}
