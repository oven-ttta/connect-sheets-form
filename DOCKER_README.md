# YEC Business Network Form - Docker Setup

## 🐳 Docker Compose Setup

### Prerequisites
- Docker
- Docker Compose

### Quick Start

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - Frontend: http://localhost:8080
   - API: http://localhost:3001 (or https://api-yec.over24h.shop in production)
   - Health Check: http://localhost:3001/api/health

3. **Test the application:**
   - Open http://localhost:8080 in your browser
   - Fill out the Business Network form
   - Upload images and submit data
   - Check Google Sheets for saved data

### Production Setup (with Nginx)

1. **Run with Nginx reverse proxy:**
   ```bash
   npm run docker:production
   # or
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
   ```

2. **Access through Nginx:**
   - Frontend: http://localhost
   - API: http://localhost/api/

### Development Setup

1. **Run in development mode:**
   ```bash
   npm run docker:dev
   # or
   docker-compose up --build
   ```

2. **Features in development mode:**
   - Hot reloading for source code changes
   - Development server with nodemon
   - Direct access to ports 8080 and 3001

### Environment Variables

Create a `.env` file or use `docker.env`:
```env
NODE_ENV=production
DOCKER=true
PORT=3001
FRONTEND_PORT=8080
```

### File Structure

```
├── docker-compose.yml    # Main compose file
├── Dockerfile           # Application container
├── nginx.conf          # Nginx configuration
├── docker.env          # Environment variables
├── uploads/            # File uploads directory
└── public/             # Static files and credentials
```

### Volumes

- `./uploads:/app/uploads` - File uploads
- `./public:/app/public` - Google Sheets credentials

### Health Check

The application includes a health check endpoint:
- URL: https://api-yec.over24h.shop/api/health
- Checks: Every 30 seconds

### Available Commands

```bash
# Development
npm run docker:dev          # Start in development mode
npm run docker:build        # Build containers
npm run docker:up           # Start containers
npm run docker:down         # Stop containers
npm run docker:logs         # View logs
npm run docker:clean        # Clean up containers and volumes

# Production
npm run docker:production   # Start in production mode with Nginx
```

### Troubleshooting

1. **Check logs:**
   ```bash
   npm run docker:logs
   # or
   docker-compose logs -f
   ```

2. **Rebuild containers:**
   ```bash
   npm run docker:down
   npm run docker:up
   # or
   docker-compose down
   docker-compose up --build
   ```

3. **Check container status:**
   ```bash
   docker-compose ps
   ```

4. **Clean up everything:**
   ```bash
   npm run docker:clean
   ```

### Development vs Production

- **Development**: Direct access to ports 8080 and 3001
- **Production**: Nginx reverse proxy on port 80

### Security Notes

- Ensure Google Sheets credentials are properly secured
- Use HTTPS in production
- Configure proper CORS settings
- Set up SSL certificates for production use
