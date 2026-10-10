# ==============================================================================
# SMART CAMPUS UNIFIED PLATFORM - PRODUCTION DOCKERFILE
# Build from project root: docker build -f docker/Dockerfile .
# ==============================================================================

FROM node:20-alpine AS base

# Install dumb-init for proper signal handling (PID 1 zombie reaper)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Install dependencies with production flags
COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

# Copy source directories
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY scripts/ ./scripts/
COPY server.js ./

# Set persistent data folder permissions for non-root node user
RUN mkdir -p /app/backend/data/backups && \
    chown -R node:node /app

# Run as unprivileged non-root user
USER node

# Environment defaults
ENV NODE_ENV=production \
    PORT=3042 \
    HTTPS_PORT=3443 \
    HOST=0.0.0.0

# Expose HTTP and HTTPS ports
EXPOSE 3042 3443

# Built-in Container Health Check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node scripts/healthcheck.js || exit 1

# Launch with dumb-init to ensure proper SIGTERM/SIGINT propagation
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "backend/server.js"]
