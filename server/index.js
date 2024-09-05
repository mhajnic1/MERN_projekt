import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';

import connectDB from './mongodb/connect.js';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import dalleRoutes from './routes/dalle.js';
import notifications from "./routes/notifications.js"
import { initializeIo } from './ioInit/notificationUtils.js';

import postRoutesOld from './routes/postRoutes.js';
import userRoutesOld from  './routes/userRoutes.js';

import { users, posts } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";


dotenv.config();

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

initializeIo(io);

app.use(cors());
app.use(express.json());


/* NEW ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/dalle", dalleRoutes);
app.use("/notifications", notifications);

app.get('/', async (req, res) => {
    res.send('Golden wind requiem')
})


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('joinRoom', (userId) => {
    socket.join(userId);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



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