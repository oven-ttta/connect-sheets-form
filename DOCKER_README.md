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
   - API: https://api-yec.over24h.shop
   - Health Check: https://api-yec.over24h.shop/api/health

### Production Setup (with Nginx)

1. **Run with Nginx reverse proxy:**
   ```bash
   docker-compose --profile production up --build
   ```

2. **Access through Nginx:**
   - Frontend: http://localhost
   - API: http://localhost/api/

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

### Troubleshooting

1. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

2. **Rebuild containers:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

3. **Check container status:**
   ```bash
   docker-compose ps
   ```

### Development vs Production

- **Development**: Direct access to ports 8080 and 3001
- **Production**: Nginx reverse proxy on port 80

### Security Notes

- Ensure Google Sheets credentials are properly secured
- Use HTTPS in production
- Configure proper CORS settings
- Set up SSL certificates for production use
