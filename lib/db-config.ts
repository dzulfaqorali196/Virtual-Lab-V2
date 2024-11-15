import mongoose from 'mongoose'

// Increase max listeners
mongoose.connection.setMaxListeners(20)

export function configureDatabase() {
  // Konfigurasi tambahan jika diperlukan
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected successfully')
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err)
  })

  // Cleanup listeners on disconnect
  mongoose.connection.on('disconnected', () => {
    mongoose.connection.removeAllListeners()
  })
} 