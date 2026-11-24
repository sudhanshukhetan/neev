/**
 * server/index.js
 * Neev API server — Express + graceful error handling.
 */
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import healthRouter from './routes/health.js';
import presetsRouter from './routes/presets.js';
import auditRouter from './routes/audit.js';
import simulateRouter from './routes/simulate.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '100kb' }));

// Routes
app.use('/api', healthRouter);
app.use('/api', presetsRouter);
app.use('/api', auditRouter);
app.use('/api', simulateRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found', code: 'NOT_FOUND' });
});

// Error handler
app.use(errorHandler);

// Process-level crash protection
process.on('unhandledRejection', (reason) => {
  console.error('[neev] Unhandled rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[neev] Uncaught exception:', err);
  process.exit(1);
});

function startServer(port) {
  const server = app.listen(port, () => {
    const aiMode = process.env.GEMINI_API_KEY ? 'gemini-vision' : 'verified-engine';
    console.log(`[neev] Server running on port ${port} | AI mode: ${aiMode}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[neev] Port ${port} is in use, falling back to ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[neev] Server error:', err);
    }
  });
}

startServer(PORT);

export default app;
