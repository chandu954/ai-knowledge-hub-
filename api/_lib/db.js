import mongoose from 'mongoose'

let isConnected = global._mongooseConnected || false

export async function connectDB(){
  if (isConnected && mongoose.connection.readyState === 1) return
  const uri = process.env.MONGO_URI
  if(!uri) throw new Error('MONGO_URI not set')
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(uri, { dbName: 'aiknowledgehub' })
  }
  isConnected = true
  global._mongooseConnected = true
}
