# Use Node.js official image as base
FROM node:18-alpine

# Set working directory
WORKDIR /app


# Install curl for health checks
RUN apk add --no-cache curl

# Copy package.json and package-lock.json (if available)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app (TypeScript + Vite build)
RUN npm run  build

# Expose port 4173 (Vite preview default port)
EXPOSE 4173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3\
  CMD curl -f http://localhost:4173/ || exit 1

  # Use Vite's built-in preview server
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0" ]  