/**
 * Production Health Check Script for Containers (Docker, Kubernetes, Podman)
 * Zero external dependencies.
 * Run with: node scripts/healthcheck.js
 */

const http = require('http');

const port = process.env.PORT || process.env.HTTP_PORT || 3042;
const host = '127.0.0.1';

const options = {
  host,
  port,
  path: '/api/health',
  method: 'GET',
  timeout: 4000
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => { body += chunk; });
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const json = JSON.parse(body);
        if (json.status === 'healthy') {
          process.stdout.write(`HEALTHY: Smart Campus v${json.version || '2.0.0'} (${json.mode || 'LIVE'}) - Uptime: ${json.uptimeSeconds}s\n`);
          process.exit(0);
        }
      } catch (e) {}
    }
    process.stderr.write(`UNHEALTHY: HTTP ${res.statusCode} - ${body}\n`);
    process.exit(1);
  });
});

req.on('timeout', () => {
  req.destroy();
  process.stderr.write('TIMEOUT: Health check request timed out after 4000ms\n');
  process.exit(1);
});

req.on('error', (err) => {
  process.stderr.write(`ERROR: Health check connection failed: ${err.message}\n`);
  process.exit(1);
});

req.end();
