import http from 'http';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { jwtVerify } from 'jose';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key-change-in-production');

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch {
    return null;
  }
}

const app = next({ dev, hostname: '0.0.0.0', port });
const handle = app.getRequestHandler();

await app.prepare();

const httpServer = http.createServer((req, res) => handle(req, res));

const io = new SocketIOServer(httpServer, {
  path: '/socket.io',
  cors: {
    origin: true,
    credentials: true,
  },
});

// Make IO accessible from route handlers in same process.
globalThis.__io = io;

io.on('connection', async (socket) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.toString()?.replace(/^Bearer\s+/i, '') ||
      null;

    if (!token) {
      // Allow anonymous connection, but only join public rooms (none for now).
      return;
    }

    const payload = await verifyToken(token);
    if (!payload) return;

    socket.join(`user:${payload.userId}`);
    if (payload.role === 'admin') socket.join('admins');
  } catch {
    // Ignore auth errors to avoid crashing server.
  }
});

httpServer.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`> Server ready on http://localhost:${port} (dev=${dev})`);
});

