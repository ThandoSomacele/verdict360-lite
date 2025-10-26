# Docker Setup for Verdict 360

Complete Docker configuration for running Verdict 360 in production or development with all required services.

## 📦 What's Included

- **PostgreSQL 15** - Database
- **Redis 7** - Caching and session storage
- **Ollama** - AI model serving (Llama 3.1/3.2)
- **Verdict360 App** - SvelteKit application with Socket.io

## 🚀 Quick Start

### Production Deployment

```bash
cd docker
docker-compose up -d
```

Access the application at **http://localhost:4000**

### Development Mode

```bash
cd docker
docker-compose -f docker-compose.dev.yml up
```

Access the application at **http://localhost:3001** (with hot reload)

## 📋 Prerequisites

- Docker 20.10+
- Docker Compose V2+
- At least 4GB RAM available
- 10GB free disk space (for Ollama models)

## 🏗️ Architecture

### Production (`docker-compose.yml`)

- **App Port**: 4000 → 3000 (container)
- **PostgreSQL**: 5432
- **Redis**: 6379
- **Ollama**: 11434
- **Build**: Multi-stage with SvelteKit adapter-node
- **Server**: Custom Node.js server with Socket.io support

### Development (`docker-compose.dev.yml`)

- **App Port**: 3001 → 3000 (container)
- **PostgreSQL**: 5433 → 5432 (container)
- **Redis**: 6380 → 6379 (container)
- **Ollama**: 11435 → 11434 (container)
- **Hot Reload**: Source code mounted as volume
- **Debugging**: Interactive mode with stdin/tty

## 📝 Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
# Database
DATABASE_URL=postgresql://verdict360_user:verdict360_password@postgres:5432/verdict360

# JWT Secrets
JWT_SECRET=your_jwt_secret_change_this
JWT_REFRESH_SECRET=your_refresh_secret_change_this

# Email (Optional)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Multi-tenant
DEFAULT_TENANT=demo
TENANT_DOMAIN_SUFFIX=.verdict360.local
```

## 🛠️ Common Commands

### Production

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# Run database migrations
docker-compose exec app npm run db:migrate

# Seed database
docker-compose exec app npm run db:seed

# Pull Ollama model
docker-compose exec ollama ollama pull llama3.1
```

### Development

```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up

# Rebuild dev container
docker-compose -f docker-compose.dev.yml up --build

# Run migrations in dev
docker-compose -f docker-compose.dev.yml exec app npm run db:migrate

# Access PostgreSQL
docker-compose -f docker-compose.dev.yml exec postgres psql -U verdict360_user -d verdict360_dev

# Access Redis
docker-compose -f docker-compose.dev.yml exec redis redis-cli -a verdict360_redis_dev_password
```

## 🔍 Troubleshooting

### App Won't Start

1. **Check logs**:
   ```bash
   docker-compose logs app
   ```

2. **Verify database connection**:
   ```bash
   docker-compose exec postgres pg_isready -U verdict360_user
   ```

3. **Check Redis**:
   ```bash
   docker-compose exec redis redis-cli ping
   ```

### Ollama Model Not Found

```bash
# Pull the model manually
docker-compose exec ollama ollama pull llama3.1:8b

# List available models
docker-compose exec ollama ollama list
```

### Database Connection Issues

```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Test connection from app container
docker-compose exec app node -e "const {db} = require('./src/lib/config/database'); db.raw('SELECT 1').then(console.log)"
```

### Port Conflicts

If you see "port already in use" errors:

**Production:**
- App: Change `4000:3000` to `<your-port>:3000` in docker-compose.yml

**Development:**
- App: Change `3001:3000` to `<your-port>:3000`
- PostgreSQL: Change `5433:5432` to `<your-port>:5432`
- Redis: Change `6380:6379` to `<your-port>:6379`
- Ollama: Change `11435:11434` to `<your-port>:11434`

## 📊 Health Checks

All services include health checks:

```bash
# Check all service health
docker-compose ps

# View specific service status
docker inspect verdict360-app | grep -A 10 Health
```

## 🔐 Security Notes

### Production

- Change default passwords in `docker-compose.yml`
- Use `.env` file for sensitive data
- Don't commit `.env` to version control
- Use strong JWT secrets (32+ characters)

### Development

- Development uses weak passwords - **NOT for production**
- Different ports to avoid conflicts with local services
- Volume mounts expose source code

## 📦 Volumes

### Production

- `postgres_data` - PostgreSQL database
- `redis_data` - Redis persistence
- `ollama_data` - Ollama models (large!)

### Development

- `postgres_dev_data` - Dev database
- `redis_dev_data` - Dev Redis data
- `ollama_dev_data` - Dev Ollama models
- Source code mounted from `..`

## 🧹 Cleanup

### Remove containers and volumes

```bash
# Production
docker-compose down -v

# Development
docker-compose -f docker-compose.dev.yml down -v
```

### Free up space

```bash
# Remove unused Docker data
docker system prune -a

# Remove only Ollama volumes (large)
docker volume rm docker_ollama_data docker_ollama_dev_data
```

## 🚀 Deployment

For VPS deployment (Coolify, etc.), use `docker-compose.yml` as a reference but follow the platform-specific deployment guide in `/DEPLOYMENT.md`.

## 📚 Additional Documentation

- **[Main README](../README.md)** - Project overview
- **[Deployment Guide](../DEPLOYMENT.md)** - VPS/Coolify deployment
- **[Quick Start](../docs/guides/QUICK_START.md)** - Getting started

## 🆘 Support

If you encounter issues:

1. Check this README's troubleshooting section
2. View container logs: `docker-compose logs <service>`
3. Verify health checks: `docker-compose ps`
4. Check GitHub Issues: [Verdict360 Issues](https://github.com/your-org/verdict360-lite/issues)

---

**Built for South African law firms** ⚖️
