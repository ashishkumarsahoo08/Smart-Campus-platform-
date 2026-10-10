/**
 * PM2 Production Ecosystem Configuration
 * Usage: pm2 start ecosystem.config.js --env production
 */

module.exports = {
  apps: [
    {
      name: 'smart-campus',
      script: './backend/server.js',
      instances: 1, // Single instance ensures atomic ACID file operations for JSON database
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'development',
        PORT: 3042
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3042
      },
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './backend/data/logs/pm2-error.log',
      out_file: './backend/data/logs/pm2-out.log',
      merge_logs: true
    }
  ]
};
