import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'


import authRoutes from './routes/auth.routes.js'
import messageRoutes from './routes/message.route.js'
import userRoutes from './routes/user.routes.js'


import connection from './db/connection.js'
import {app, server} from './socket/socket.js'

dotenv.config()

// const app = express()
const PORT = process.env.PORT || 5000


app.use(express.json())
app.use(cookieParser())


app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/users", userRoutes)


app.get('/', (req, res) => {
    res.send("Aa gye wapis")
})


server.listen(PORT, () => {
    connection()
    console.log("Server Running....");
})

