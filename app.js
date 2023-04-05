import express from 'express'
import cors from 'cors'
import { postController } from './controllers/posts/post-controller.js';
import { userController } from './controllers/users/user-controller.js';

const app = express()

app.use(cors())
app.use(express.json())

postController(app)
userController(app)

console.log('listening on port 4000')
app.listen(process.env.PORT || 4000)