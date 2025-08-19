# Base Image
FROM node:18-alpine AS deps

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# crete working directory within container
WORKDIR /app

# Copy package files first ( for better layer caching)
COPY package*.json ./

# Install dependencies including devDependencies for potential build steps
RUN npm ci


# 🏗️ STAGE 2: Build Stage (if you have build steps)
FROM node:18-alpine AS builder

# Install dumb-init
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application code
COPY . .

# 🚀 STAGE 3: Production Environment
FROM node:18-alpine AS production

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Add labels
LABEL maintainer="bunnabnl@gmail.com"
LABEL description="DevOps Tracker Backend API"
LABEL version="1.0"

# Expose port
EXPOSE 5002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node healthcheck.js || exit 1

# Start the application
CMD ["node", "server.js"]