import express from 'express'
import "dotenv/config"
import cors from 'cors'
import { Server } from 'socket.io'
import { connectDB } from './lib/db.js'
import userRouter from './routes/user.router.js'
import messageRoute from './routes/message.router.js'
import http from 'http'

const app = express()
const server = http.createServer(app)

await connectDB()
const PORT = process.env.PORT || 8000
app.use(express.json({ limit: '4mb' }))
app.use(cors())

export const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

export const userSocketMap = {}

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId
    if (userId) userSocketMap[userId] = socket.id
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
    socket.on('disconnect', () => {
        delete userSocketMap[userId]
        io.emit('getOnlineUsers', Object.keys(userSocketMap))
    })
})

app.use('/api/v1/user', userRouter)
app.use('/api/v1/message', messageRoute)

server.listen(PORT, () => {
    console.log(`server is running http://localhost:${PORT}`)
})
