import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './mongodb/connect.js';
import postRoutesOld from './routes/postRoutes.js';
import userRoutesOld from  './routes/userRoutes.js';
import { users, posts } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";


import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import dalleRoutes from './routes/dalle.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

//app.use('/api/v1/post', postRoutesOld);
//app.use('/api/v1/dalle', dalleRoutes);
//app.use('/api/users', userRoutesOld);

/* NEW ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/dalle", dalleRoutes);

app.get('/', async (req, res) => {
    res.send('Golden wind requiem')
})

const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log('Server has started on port http://localhost:8080'))

        /* ADD DATA ONE TIME */
        /* User.insertMany(users);
        Post.insertMany(posts); */

    } catch (error) {
        console.log(error)
    }
}

startServer();