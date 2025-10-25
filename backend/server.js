import express from 'express'
import "dotenv/config"
import cors from 'cors'
import { connectDB } from './lib/db.js'


const app = express()
await connectDB()
app.use(express.json({ limit: '4mb' }))
app.use(cors())
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`)
})






