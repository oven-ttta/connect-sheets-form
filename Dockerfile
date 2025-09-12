# Dockerfile for YEC Business Network Form
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port 8080 for frontend
EXPOSE 8080

# Expose port 3001 for API
EXPOSE 3001

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start both frontend and API
CMD ["sh", "-c", "npm run server & npm run preview -- --port 8080 --host 0.0.0.0"]
