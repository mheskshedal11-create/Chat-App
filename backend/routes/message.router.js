import express from 'express'
import { getMessages, getUsersForSidebar, markMessageAsSeen } from '../controllers/message.controller.js'
import { protectRoute } from '../middleware/auth.js'

const messageRoute = express.Router()

messageRoute.get('/users', protectRoute, getUsersForSidebar)
messageRoute.get('/:id', protectRoute, getMessages)
messageRoute.put('mark/:id', protectRoute, markMessageAsSeen)

export default messageRoute