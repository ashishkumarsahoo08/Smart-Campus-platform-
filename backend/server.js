const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const http = require('http');
const https = require('https');
const os = require('os');

// Simple native .env loader (zero external dependency)
function loadEnv() {
  const envPaths = [
    path.join(__dirname, '..', '.env'),
    path.join(__dirname, '.env')
  ];
  for (const p of envPaths) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, 'utf8');
        raw.split(/\r?\n/).forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const idx = trimmed.indexOf('=');
            if (idx !== -1) {
              const key = trimmed.slice(0, idx).trim();
              const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
              if (process.env[key] === undefined) {
                process.env[key] = val;
              }
            }
          }
        });
      } catch (e) {
        console.warn('Could not parse .env file:', e.message);
      }
      break;
    }
  }
}
loadEnv();

const { loadDb, getDb } = require('./db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const gatePassRoutes = require('./routes/gatePassRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const systemRoutes = require('./routes/systemRoutes');
const feeRoutes = require('./routes/feeRoutes');
const translationRoutes = require('./routes/translationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const syncRoutes = require('./routes/syncRoutes');
const systemController = require('./controllers/systemController');

const app = express();

// Trust reverse proxies (Nginx, Cloudflare, AWS ALB, Render, Railway, Fly.io, Heroku)
app.set('trust proxy', 1);

// Prevent framework fingerprinting
app.disable('x-powered-by');

// Enhanced Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()');
  if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// Production In-Memory Rate Limiting (Zero external dependencies)
function createRateLimiter(options) {
  const { windowMs = 60000, max = 100, message = 'Too many requests, please try again later.' } = options;
  const requests = new Map();

  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of requests.entries()) {
      if (now > record.resetTime) {
        requests.delete(ip);
      }
    }
  }, 120000);
  if (cleanup.unref) cleanup.unref();

  return (req, res, next) => {
    if (process.env.DISABLE_RATE_LIMIT === 'true') return next();
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const now = Date.now();
    let record = requests.get(ip);

    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      requests.set(ip, record);
      return next();
    }

    record.count++;
    if (record.count > max) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        error: 'Too Many Requests',
        message: message,
        retryAfterSeconds: retryAfter
      });
    }

    next();
  };
}

const apiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 600,
  message: 'API rate limit exceeded. Please wait a moment before trying again.'
});

const authLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: 'Too many authentication attempts. Please try again after 5 minutes.'
});

const aiLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 60,
  message: 'AI query limit reached. Please wait before asking more questions.'
});

// Configurable CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? true : corsOrigin.split(',').map(s => s.trim()),
  credentials: true
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Load initial database
loadDb();

// Health Check Endpoint for Cloud & Container Orchestrators
app.get('/api/health', (req, res) => {
  const db = getDb();
  res.json({
    status: 'healthy',
    mode: db.mode || 'DEMO',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    usersCount: Object.keys(db.users || {}).length,
    institutionsCount: Object.keys(db.institutions || {}).length,
    environment: process.env.NODE_ENV || 'production'
  });
});

// API Routes with Rate Limiting Protection
app.use('/api', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/ai/chat', aiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/gatepasses', gatePassRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/sync', syncRoutes);
app.get('/api/network-info', systemController.getNetworkInfo);

// Serve static frontend files from the frontend folder
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
app.use(express.static(FRONTEND_DIR, {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0',
  etag: true
}));

// Fallback route for SPA
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(FRONTEND_DIR, 'index.html'));
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An unexpected server error occurred.' : err.message
  });
});

// Ports & Host configuration
const HTTP_PORT = process.env.PORT || process.env.HTTP_PORT || 3042;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;
const CERT_PATH = path.join(FRONTEND_DIR, 'cert.pem');
const KEY_PATH = path.join(FRONTEND_DIR, 'key.pem');

function getLocalIp() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();

// Start HTTP Server
const httpServer = http.createServer(app);
httpServer.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 Smart Campus Full-Stack Platform [Production Ready]`);
  console.log(`   ➜ Web & API:  http://localhost:${HTTP_PORT}/`);
  console.log(`   ➜ Network IP: http://${localIp}:${HTTP_PORT}/`);
  console.log(`   ➜ Health:     http://localhost:${HTTP_PORT}/api/health`);
  console.log(`   ➜ Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`=======================================================`);
});

// Start HTTPS Server if certificates exist
let httpsServer = null;
if (fs.existsSync(CERT_PATH) && fs.existsSync(KEY_PATH)) {
  try {
    const sslOptions = {
      key: fs.readFileSync(KEY_PATH),
      cert: fs.readFileSync(CERT_PATH)
    };
    httpsServer = https.createServer(sslOptions, app);
    httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
      console.log(`🔒 Secure TLS:  https://localhost:${HTTPS_PORT}/`);
    });
  } catch (err) {
    console.warn('Notice: HTTPS server could not be started:', err.message);
  }
}

// Graceful Shutdown
function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Shutting down servers gracefully...`);
  httpServer.close(() => {
    console.log('HTTP server terminated.');
    if (httpsServer) {
      httpsServer.close(() => {
        console.log('HTTPS server terminated.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
  setTimeout(() => {
    console.error('Forced exit after timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Process Crash Guards (prevent silent unexpected termination in cloud containers)
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception thrown:', err);
});

module.exports = app;
