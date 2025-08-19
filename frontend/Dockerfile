# STAGE 1: Build React Application
FROM node:18-alpine AS builder

# Create working directory name app in container
WORKDIR /app

# Copy all package*.json to app directory in container 
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy all source code into app directory in container
COPY . .

# Build the application
RUN npm run build

# STAGE 2: Production Server
FROM nginx:alpine AS production

# Install curl for health checks
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Add labels for better organization
LABEL maintainer="bunnabnl@gmail.com"
LABEL description="DevOps Tracker Frontend"
LABEL version="1.0"

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]