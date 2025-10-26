# Multi-stage build for SvelteKit application with Socket.io
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./

# Use npm install instead of ci for production deps
# (npm ci can be strict with lockfile changes)
RUN npm install --production --frozen-lockfile || npm install --production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy all dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Install dev dependencies for build
RUN npm install

# Copy source code
COPY . .

# Build SvelteKit application
ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run the application
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 verdictuser

# Copy built application from builder
COPY --from=builder --chown=verdictuser:nodejs /app/build ./build
COPY --from=builder --chown=verdictuser:nodejs /app/server.js ./server.js
COPY --from=builder --chown=verdictuser:nodejs /app/package*.json ./

# Copy production dependencies
COPY --from=deps --chown=verdictuser:nodejs /app/node_modules ./node_modules

# Copy database migrations and seeds
COPY --from=builder --chown=verdictuser:nodejs /app/src/lib/server/database ./src/lib/server/database

# Copy knexfile for migrations
COPY --from=builder --chown=verdictuser:nodejs /app/knexfile.js ./knexfile.js

# Create logs and uploads directories
RUN mkdir -p logs uploads && chown -R verdictuser:nodejs logs uploads

USER verdictuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application with custom server (Socket.io + SvelteKit)
CMD ["node", "server.js"]
