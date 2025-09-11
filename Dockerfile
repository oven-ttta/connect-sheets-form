# Dockerfile for YEC Business Network Form
FROM node:18-alpine

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

# Expose port 8080 for frontend
EXPOSE 8080

# Expose port 3001 for API
EXPOSE 3001

# Start both frontend and API
CMD ["sh", "-c", "npm run server & npm run preview -- --port 8080 --host 0.0.0.0"]
