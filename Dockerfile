# Dockerfile for Next.js app (helpex)
# Multi-stage build for production

# 1. Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source code
COPY . .

# Build the Next.js app
RUN npm run build

# 2. Production stage
FROM node:20-alpine AS runner
WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* yarn.lock* ./
RUN if [ -f yarn.lock ]; then yarn install --frozen-lockfile --production; \
    elif [ -f package-lock.json ]; then npm ci --omit=dev; \
    else npm install --omit=dev; fi

# Copy built app from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js* ./
COPY --from=builder /app/src ./src

# Set environment variables
ENV NODE_ENV=production

# Expose port (default Next.js)
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
