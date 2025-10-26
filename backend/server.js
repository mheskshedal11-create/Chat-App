import express from 'express'
import "dotenv/config"
import cors from 'cors'
import { connectDB } from './lib/db.js'
import userRouter from './routes/user.router.js'


const app = express()

await connectDB()
const PORT = process.env.PORT || 8000
app.use(express.json({ limit: '4mb' }))

app.use(cors())

app.use('api/v1/user', userRouter)

app.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`)
})






