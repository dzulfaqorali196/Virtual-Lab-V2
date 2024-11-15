import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

// Connection options
const CONNECTION_OPTIONS = {
  bufferCommands: false,
  maxPoolSize: 10,
  minPoolSize: 5,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
  heartbeatFrequencyMS: 10000,
  retryWrites: true,
  retryReads: true,
  maxIdleTimeMS: 30000,
  connectTimeoutMS: 10000
}

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

let reconnectTimeout: NodeJS.Timeout

export async function connectDB() {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn
  }

  // Return existing promise if connection is in progress
  if (cached.promise) {
    return cached.promise
  }

  cached.promise = mongoose
    .connect(MONGODB_URI, CONNECTION_OPTIONS)
    .then((mongoose) => {
      return mongoose
    })
    .catch((error) => {
      cached.promise = null
      console.error('MongoDB connection error:', error)
      throw error
    })

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

// Enhanced cleanup function
export async function disconnectDB(force: boolean = false) {
  try {
    if (cached.conn) {
      // Wait for pending operations to complete unless force is true
      if (!force) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      await mongoose.disconnect()
      cached.conn = null
      cached.promise = null
      clearTimeout(reconnectTimeout)
    }
  } catch (error) {
    console.error('Error during disconnect:', error)
    throw error
  }
}

// Connection state change handlers
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully')
})

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err)
  // Attempt to reconnect
  if (!reconnectTimeout) {
    reconnectTimeout = setTimeout(async () => {
      try {
        await disconnectDB(true)
        await connectDB()
      } catch (error) {
        console.error('Reconnection failed:', error)
      }
      reconnectTimeout = null as any
    }, 5000)
  }
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected')
})

// Graceful shutdown handler
process.on('SIGINT', async () => {
  try {
    await disconnectDB()
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
})

// Export additional utilities
export const getConnectionStatus = () => ({
  isConnected: mongoose.connection.readyState === 1,
  readyState: mongoose.connection.readyState,
  poolSize: (mongoose.connection as any).pool?.size || 0,
  host: mongoose.connection.host
})