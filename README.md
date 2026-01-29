# CDUP - Customer Data Update Portal

A comprehensive, role-based web application for automating customer data updates, replacing manual Excel-driven processes with a streamlined, secure digital workflow.

![Version](https://img.shields.io/badge/version-2.1.0-blue)
![Java](https://img.shields.io/badge/Java-17+-orange)
![React](https://img.shields.io/badge/React-18.2-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

---

## Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Real-time statistics, charts, and activity feed |
| **Customer Update** | 3-step wizard form with real-time validation |
| **Bulk Upload** | Excel file upload with preview and batch processing |
| **Approvals** | Workflow-based approval/rejection system |
| **Audit Trail** | Comprehensive, searchable audit logs |
| **Reports & Analytics** | Daily, weekly, monthly reports with charts |
| **User Management** | RBAC with 5 role types |
| **Settings** | System configuration and preferences |
| **Notifications** | In-app notification center |
| **Profile** | User profile management |
| **Help & Support** | FAQs, guides, and support contacts |

### Role-Based Access Control

| Role | Access Level | Capabilities |
|------|--------------|--------------|
| **Admin** | Full | All features, user management, system settings |
| **Supervisor** | Level 2 | Approvals, reports, team monitoring |
| **Agent** | Level 1 | Submit requests, view own submissions |
| **Engineer** | Level 3 | Bulk uploads, exceptions, system config |
| **Auditor** | Read-Only | Audit logs, compliance reports |

---

## Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.2.1**
- **Spring Security** + **JWT Authentication**
- **Spring Data JPA** + **Hibernate**
- **MySQL 8.0+** (MySQL Workbench)
- **Flyway** for database migrations
- **Swagger/OpenAPI** for API documentation

### Frontend
- **React 18.2** + **TypeScript**
- **Tailwind CSS 3.4** for styling
- **React Router 6** for navigation
- **React Query** for data fetching
- **Recharts** for visualizations
- **Lucide React** for icons

---

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.8+

### Development Setup

```bash
# Clone the repository
git clone https://github.com/your-org/DataLink.git
cd DataLink

# Run setup script
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh

# Start backend (Terminal 1)
cd backend
./mvnw spring-boot:run

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/api/swagger-ui.html

---

## Default Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |
| Supervisor | `supervisor1` | `Super@123` |
| Agent | `agent1` | `Agent@123` |
| Engineer | `engineer1` | `Eng@123` |
| Auditor | `auditor1` | `Audit@123` |

---

## Project Structure

```
DataLink/
├── backend/                 # Spring Boot API
│   ├── src/main/java/com/cdup/
│   │   ├── config/         # Configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── repository/     # Data access layer
│   │   ├── model/          # Entities, DTOs, Enums
│   │   ├── security/       # JWT, authentication
│   │   └── util/           # Utilities
│   └── src/main/resources/
│       ├── db/migration/   # Flyway migrations
│       └── application.yml # Configuration
│
├── frontend/               # React application
│   └── src/
│       ├── components/     # UI components
│       ├── services/       # API client
│       ├── context/        # React context
│       ├── hooks/          # Custom hooks
│       ├── types/          # TypeScript types
│       └── utils/          # Utilities
│
├── docs/                   # Documentation
├── scripts/                # Utility scripts
└── postman/               # API collection
```

---

## API Documentation

See [docs/API.md](docs/API.md) for detailed API documentation.

### Quick Examples

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Create request (with token)
curl -X POST http://localhost:8080/api/requests \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"cnic":"12345-1234567-1","mobileNumber":"03001234567"}'
```

---

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

### Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `./mvnw test` (backend) / `npm test` (frontend)
4. Submit a pull request

---

## License

Proprietary - All rights reserved.

---

## Support

- **Email:** support@cdup.com
- **Phone:** +92 42 35123456
- **Documentation:** [docs/](docs/)
