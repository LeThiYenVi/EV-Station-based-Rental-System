# Docker Build & Deployment Guide

## 🐳 Backend (Spring Boot)

### Build Docker Image
```bash
cd BE

# Build image
docker build -t evrental-backend:latest .

# Build with specific tag
docker build -t evrental-backend:1.0.0 .

# Build for multi-platform (for AWS ECR)
docker buildx build --platform linux/amd64 -t evrental-backend:latest .
```

### Run Locally
```bash
# Run with docker-compose (includes PostgreSQL + Redis)
docker-compose -f docker-compose.prod.yml up -d

# Run standalone (connect to existing DB)
docker run -d \
  -p 8080:8080 \
  --name evrental-backend \
  -e POSTGRES_DB_NAME=vehicle_rental \
  -e POSTGRES_USERNAME=postgres \
  -e POSTGRES_PASSWORD=your_password \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/vehicle_rental \
  -e SPRING_DATA_REDIS_HOST=host.docker.internal \
  -e AWS_COGNITO_CLIENT_ID=your_client_id \
  -e AWS_COGNITO_CLIENT_SECRET=your_secret \
  evrental-backend:latest
```

### Push to AWS ECR
```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

# Create repository (first time only)
aws ecr create-repository --repository-name evrental-backend --region ap-southeast-1

# Tag image
docker tag evrental-backend:latest <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/evrental-backend:latest

# Push image
docker push <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/evrental-backend:latest
```

### Optimization Features
- ✅ Multi-stage build (builder + runtime)
- ✅ Layer caching for Maven dependencies
- ✅ Alpine-based JRE (smaller image ~200MB)
- ✅ Non-root user for security
- ✅ Health check endpoint
- ✅ Optimized JVM settings for containers
- ✅ dumb-init for proper signal handling

---

## 🎨 Frontend (React + Vite)

### Build Docker Image
```bash
cd FE/aws-project

# Build image
docker build -t evrental-frontend:latest .

# Build with specific tag
docker build -t evrental-frontend:1.0.0 .

# Build for multi-platform
docker buildx build --platform linux/amd64 -t evrental-frontend:latest .
```

### Run Locally
```bash
# Run with docker-compose
docker-compose up -d

# Run standalone
docker run -d \
  -p 8080:8080 \
  --name evrental-frontend \
  evrental-frontend:latest
```

### Push to AWS ECR
```bash
# Login to ECR
aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com

# Create repository (first time only)
aws ecr create-repository --repository-name evrental-frontend --region ap-southeast-1

# Tag image
docker tag evrental-frontend:latest <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/evrental-frontend:latest

# Push image
docker push <account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/evrental-frontend:latest
```

### Optimization Features
- ✅ Multi-stage build (builder + nginx)
- ✅ pnpm for faster dependency installation
- ✅ Nginx for production serving (~50MB total)
- ✅ Non-root user for security
- ✅ Gzip compression enabled
- ✅ Static asset caching
- ✅ SPA routing support
- ✅ Health check endpoint
- ✅ Security headers

---

## 📊 Image Size Comparison

### Before Optimization (typical):
- Backend: ~500MB (full JDK + source code)
- Frontend: ~800MB (node_modules in production)

### After Optimization:
- Backend: ~200MB (JRE + compiled JAR only)
- Frontend: ~50MB (nginx + static files only)

**Total Savings: ~1GB per deployment**

---

## 🚀 AWS ECS Deployment

### Backend Task Definition (JSON)
```json
{
  "family": "evrental-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/evrental-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "AWS_REGION", "value": "ap-southeast-1"},
        {"name": "POSTGRES_DB_NAME", "value": "vehicle_rental"}
      ],
      "secrets": [
        {"name": "POSTGRES_USERNAME", "valueFrom": "arn:aws:secretsmanager:..."},
        {"name": "POSTGRES_PASSWORD", "valueFrom": "arn:aws:secretsmanager:..."}
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/evrental-backend",
          "awslogs-region": "ap-southeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Frontend Task Definition (JSON)
```json
{
  "family": "evrental-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "<account-id>.dkr.ecr.ap-southeast-1.amazonaws.com/evrental-frontend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "healthCheck": {
        "command": ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 10
      },
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/evrental-frontend",
          "awslogs-region": "ap-southeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 🧪 Testing

### Backend
```bash
# Check health
curl http://localhost:8080/actuator/health

# Check logs
docker logs evrental-backend

# Interactive shell
docker exec -it evrental-backend sh
```

### Frontend
```bash
# Check health
curl http://localhost:8080/health

# Access application
curl http://localhost:8080/

# Check logs
docker logs evrental-frontend

# Interactive shell
docker exec -it evrental-frontend sh
```

---

## 🔧 Troubleshooting

### Backend Issues
```bash
# Check if PostGIS extension is enabled
docker exec -it evrental-postgres psql -U postgres -d vehicle_rental -c "SELECT PostGIS_Version();"

# Check environment variables
docker exec evrental-backend env

# Check Java process
docker exec evrental-backend ps aux
```

### Frontend Issues
```bash
# Check nginx configuration
docker exec evrental-frontend nginx -t

# Check nginx process
docker exec evrental-frontend ps aux

# View nginx logs
docker exec evrental-frontend cat /var/log/nginx/error.log
```

---

## 📝 Best Practices

1. **Always use specific tags** instead of `latest` in production
2. **Scan images for vulnerabilities** before deploying
3. **Use secrets manager** for sensitive data
4. **Enable health checks** for auto-recovery
5. **Monitor logs** with CloudWatch
6. **Set resource limits** appropriately
7. **Use multi-stage builds** to reduce image size
8. **Run as non-root user** for security
9. **Enable auto-scaling** based on CPU/Memory
10. **Implement graceful shutdown** handling
