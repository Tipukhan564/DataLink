# CDUP Deployment Guide

## Prerequisites

- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven 3.8+** (for building backend)
- **MySQL 8.0+** (MySQL Workbench)
- **Redis** (optional, for caching)

---

## Development Setup

### Database Setup (MySQL Workbench)

1. **Open MySQL Workbench** and connect to your local MySQL server
2. **Create the database:**
   ```sql
   CREATE DATABASE cdup_db;
   ```

### Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Database is pre-configured in `application.yml`:**
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/cdup_db
       username: root
       password: JSBL@admin123
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

4. **Access UI:** http://localhost:5173

---

## Production Deployment

### Backend (JAR)

1. **Build the JAR:**
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```

2. **Run with production settings:**
   ```bash
   java -jar target/customer-data-portal-1.0.0-SNAPSHOT.jar \
     --spring.datasource.url=jdbc:mysql://your-mysql-host:3306/cdup_db \
     --spring.datasource.username=root \
     --spring.datasource.password=your_password
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
      - DB_URL=jdbc:mysql://mysql:3306/cdup_db?useSSL=false&allowPublicKeyRetrieval=true
      - DB_USERNAME=root
      - DB_PASSWORD=JSBL@admin123
    depends_on:
      - mysql

  frontend:
    image: cdup-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend

  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=JSBL@admin123
      - MYSQL_DATABASE=cdup_db
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_URL` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/cdup_db` |
| `DB_USERNAME` | Database username | `root` |
| `DB_PASSWORD` | Database password | `JSBL@admin123` |
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

### Database Backup (MySQL)

```bash
mysqldump -u root -p cdup_db > cdup_backup.sql
```

### Restore

```bash
mysql -u root -p cdup_db < cdup_backup.sql
```
