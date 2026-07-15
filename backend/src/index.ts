import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*' },
});

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'bookbazaar-backend' });
});

app.get('/api/books', (_req, res) => {
  res.json([
    { id: 1, title: 'The Alchemist', author: 'Paulo Coelho', price: '₹320' },
    { id: 2, title: 'Atomic Habits', author: 'James Clear', price: '₹450' },
  ]);
});

io.on('connection', (socket) => {
  socket.on('join_chat', (room: string) => socket.join(room));
  socket.on('send_message', (payload: { room: string; message: string }) => {
    io.to(payload.room).emit('receive_message', payload.message);
  });
});

const PORT = Number(process.env.PORT ?? 5000);
httpServer.listen(PORT, () => {
  console.log(`BookBazaar backend running on http://localhost:${PORT}`);
});
