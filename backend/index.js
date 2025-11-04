import express from "express";
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from "cookie-parser";
import compression from 'compression'
import tourRoute from './routes/tours.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/bookings.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 8000
const corsOptions = {
   origin: ["http://localhost:3000"],
   credentials: true,
   methods: ["GET", "POST", "PUT", "DELETE"],
   allowedHeaders: ["Content-Type", "Authorization"]
}

mongoose.set("strictQuery", false)
const connect = async() => {
   try {
      await mongoose.connect(process.env.MONGO_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         serverSelectionTimeoutMS: 5000,
         family: 4  // Force IPv4
      })

      console.log('MongoDB connected successfully')
   } catch (error) {
      console.log('MongoDB connection failed:', error.message)
   }
}

// Apply compression middleware
app.use(compression())

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.use(cors(corsOptions))
app.use(cookieParser())

// Add cache control headers
app.use((req, res, next) => {
    res.set('Cache-Control', 'public, max-age=300') // Cache for 5 minutes
    next()
})
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/tours", tourRoute)
app.use("/api/v1/users", userRoute)
app.use("/api/v1/review", reviewRoute)
app.use("/api/v1/booking", bookingRoute)

app.listen(port, () => {
   connect()
   console.log('server listening on port', port)
})