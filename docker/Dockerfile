# Multi-stage build for Node.js application
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies for both root and client
COPY package*.json ./
RUN npm ci --only=production

# Install client dependencies
COPY src/client/package*.json ./src/client/
RUN cd src/client && npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/src/client/node_modules ./src/client/node_modules

# Copy source code
COPY . .

# Build client
RUN cd src/client && npm run build

# Build server
RUN npm run server:build

# Production image, copy all the files and run the application
FROM base AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 verdictuser

# Copy built application
COPY --from=builder --chown=verdictuser:nodejs /app/dist ./dist
COPY --from=builder --chown=verdictuser:nodejs /app/src/client/build ./src/client/build
COPY --from=builder --chown=verdictuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=verdictuser:nodejs /app/package*.json ./

# Copy database files
COPY --from=builder --chown=verdictuser:nodejs /app/src/server/database ./src/server/database
COPY --from=builder --chown=verdictuser:nodejs /app/src/server/config ./src/server/config

# Create logs directory
RUN mkdir -p logs uploads && chown -R verdictuser:nodejs logs uploads

USER verdictuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/server/index.js"]