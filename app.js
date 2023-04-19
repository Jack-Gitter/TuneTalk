import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import session from 'express-session'

import { postController } from './controllers/posts/post-controller.js';
import { userController } from './controllers/users/user-controller.js';

const app = express()

const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/WebdevFinal'

app.use(cors(
    {
        credentials: true,
    }
))
app.use(express.json())
app.set('trust proxy', 1)
app.use(session({
    secret: 'secret',
    resave: true, 
    saveUninitialized: true,
}))

postController(app)
userController(app)

console.log('listening on port 4000')
app.listen(process.env.PORT || 4000)
mongoose.connect(CONNECTION_STRING)