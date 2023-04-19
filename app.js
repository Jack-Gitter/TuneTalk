import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose';
import session from 'express-session'

import { postController } from './controllers/posts/post-controller.js';
import { userController } from './controllers/users/user-controller.js';


const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017/WebdevFinal'

const app = express()
app.use(cors(
    {
        credentials: true,
        origin: 'http://localhost:3000'
    }
))
app.use(session({
    secret: 'secret',
    resave: true, 
    saveUninitialized: true,
}))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,UPDATE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
})

app.set('trust proxy', 1)
app.use(express.json())

postController(app)
userController(app)

console.log('listening on port 4000')
app.listen(process.env.PORT || 4000)
mongoose.connect(CONNECTION_STRING)