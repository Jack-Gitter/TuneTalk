import express from 'express'
import { postController } from './controllers/post-controllers.js';

const app = express()
app.use(express.json());
postController(app);





console.log('listening on port 4000');
app.listen(4000);