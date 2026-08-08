import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// Health check endpoint for Render monitoring
app.get('/healthz', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Serve static assets from Vite build directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: true,
  immutable: true,
  setHeaders: (res, filepath) => {
    // HTML files should revalidate to support instant deployments
    if (filepath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
}));

// SPA Fallback for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start Express server
const server = app.listen(PORT, HOST, () => {
  console.log(`[Render Web Service] Production server listening on http://${HOST}:${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`[Render Web Service] Received ${signal}, closing HTTP server...`);
  server.close(() => {
    console.log('[Render Web Service] Server closed. Exiting process.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
