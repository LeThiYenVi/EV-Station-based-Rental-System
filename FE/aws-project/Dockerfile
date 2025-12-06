# Optimized Dockerfile for React + Vite Frontend (Node.js serve)
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (production only for smaller image)
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code and config files
COPY . .

# Build the application
RUN pnpm run build

# Remove dev dependencies to reduce image size
RUN pnpm prune --prod

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5173/ || exit 1

# Use dumb-init
ENTRYPOINT ["dumb-init", "--"]

# Start Vite preview server
CMD ["pnpm", "run", "preview", "--host", "0.0.0.0", "--port", "5173"]
