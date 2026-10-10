#!/usr/bin/env bash
# ========================================================
# SMART CAMPUS PLATFORM - LINUX / MACOS PRODUCTION DEPLOYER
# ========================================================

set -e

echo "========================================================"
echo "  SMART CAMPUS PLATFORM - PRODUCTION DEPLOYER"
echo "========================================================"

# 1. Verify Node.js
if ! command -v node &> /dev/null; then
    echo "❌ [ERROR] Node.js is not installed!"
    echo "Please install Node.js 18+ (https://nodejs.org/)"
    exit 1
fi

echo "✅ [INFO] Detected Node.js: $(node -v)"

# 2. Check environment config
if [ ! -f ".env" ]; then
    echo "ℹ️  [INFO] Creating .env from .env.example..."
    cp .env.example .env
fi

# 3. Dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 [INFO] Installing production dependencies..."
    npm ci --only=production
fi

# 4. Ensure directories exist
mkdir -p backend/data/backups backend/data/logs

echo ""
echo "========================================================"
echo "  🚀 Starting Smart Campus Platform..."
echo "  ➜ Web App: http://localhost:3042/"
echo "  ➜ Health:  http://localhost:3042/api/health"
echo "  ➜ Stop:    Press CTRL + C"
echo "========================================================"
echo ""

export NODE_ENV=production
node backend/server.js
