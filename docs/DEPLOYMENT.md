# CDUP Deployment Guide

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven 3.8+** (for building backend)
- **Oracle Database** or **H2** (for development)
- **Redis** (optional, for caching)

---

## Development Setup

### Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Configure database:**
   Edit `src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:h2:mem:cdupdb
       username: sa
       password:
   ```

3. **Run the application:**
   ```bash
   ./mvnw spring-boot:run
   ```

4. **Access API:** http://localhost:8080/api
5. **Swagger UI:** http://localhost:8080/api/swagger-ui.html

### Frontend

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Access UI:** http://localhost:3000

---

## Production Deployment

### Backend (JAR)

1. **Build the JAR:**
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```

2. **Run with production profile:**
   ```bash
   java -jar target/cdup-backend-1.0.0.jar \
     --spring.profiles.active=prod \
     --spring.datasource.url=jdbc:oracle:thin:@//host:1521/ORCL \
     --spring.datasource.username=cdup_user \
     --spring.datasource.password=secure_password
   ```

### Frontend (Static Build)

1. **Build for production:**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the `dist` folder** using Nginx, Apache, or any static file server.

---

## Docker Deployment

### Build Images

```bash
# Backend
docker build -t cdup-backend:latest ./backend

# Frontend
docker build -t cdup-frontend:latest ./frontend
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    image: cdup-backend:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - DB_URL=jdbc:oracle:thin:@//oracle:1521/ORCL
      - DB_USERNAME=cdup_user
      - DB_PASSWORD=secure_password
    depends_on:
      - oracle

  frontend:
    image: cdup-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend

  oracle:
    image: container-registry.oracle.com/database/express:21.3.0-xe
    ports:
      - "1521:1521"
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `dev` |
| `DB_URL` | Database JDBC URL | H2 in-memory |
| `DB_USERNAME` | Database username | `sa` |
| `DB_PASSWORD` | Database password | (empty) |
| `JWT_SECRET` | JWT signing secret | (generated) |
| `JWT_EXPIRATION` | Token expiration (ms) | `86400000` |
| `MAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `MAIL_USERNAME` | SMTP username | - |
| `MAIL_PASSWORD` | SMTP password | - |

---

## Health Checks

- **Backend:** `GET /api/actuator/health`
- **Database:** `GET /api/actuator/health/db`

---

## Monitoring

The application exposes Prometheus metrics at `/api/actuator/prometheus`.

### Grafana Dashboard

Import the pre-configured dashboard from `docs/grafana-dashboard.json`.

---

## Backup & Recovery

### Database Backup

```bash
# Oracle
expdp cdup_user/password@ORCL directory=DATA_PUMP_DIR dumpfile=cdup_backup.dmp
```

### Restore

```bash
impdp cdup_user/password@ORCL directory=DATA_PUMP_DIR dumpfile=cdup_backup.dmp
```
