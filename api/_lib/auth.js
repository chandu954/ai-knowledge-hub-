import jwt from 'jsonwebtoken'

export function requireAuth(req, res){
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) { res.status(401).json({error:'Unauthorized'}); return null }
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  }catch(e){
    res.status(401).json({error:'Invalid token'}); return null
  }
}
