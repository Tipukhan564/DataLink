# CDUP API Documentation

## Overview

The Customer Data Update Portal (CDUP) API provides RESTful endpoints for managing customer data updates, user authentication, bulk uploads, approvals, and reporting.

**Base URL:** `http://localhost:8080/api`

**Authentication:** Bearer Token (JWT)

---

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "role": "ADMIN"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Customer Update Requests

### Create Request
```http
POST /requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "cnic": "12345-1234567-1",
  "mobileNumber": "03001234567",
  "email": "customer@email.com",
  "nextOfKin": "John Doe",
  "fatherName": "Father Name",
  "motherName": "Mother Name",
  "sourceOfIncome": "SALARY",
  "purposeOfAccount": "SAVINGS",
  "latitude": "33.6844",
  "longitude": "73.0479",
  "ccRemarks": "Verification completed",
  "selfieCnicVerified": true
}
```

### Get All Requests
```http
GET /requests?page=0&size=20&sortBy=createdAt&sortDir=desc
Authorization: Bearer <token>
```

### Get Request by ID
```http
GET /requests/{id}
Authorization: Bearer <token>
```

### Search Requests
```http
GET /requests/search?cnic=12345&status=PENDING&startDate=2024-01-01
Authorization: Bearer <token>
```

---

## Approvals

### Get Pending Approvals
```http
GET /approvals/pending?page=0&size=20
Authorization: Bearer <token>
```

### Approve/Reject Request
```http
POST /approvals/action
Authorization: Bearer <token>
Content-Type: application/json

{
  "requestId": 123,
  "action": "APPROVE",
  "comments": "Approved after verification"
}
```

---

## Bulk Upload

### Upload Excel File
```http
POST /bulk-upload/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <excel-file.xlsx>
```

### Get Upload Preview
```http
GET /bulk-upload/{id}/preview
Authorization: Bearer <token>
```

### Process Upload
```http
POST /bulk-upload/{id}/process
Authorization: Bearer <token>
```

---

## Reports

### Get Daily Report
```http
GET /reports/daily
Authorization: Bearer <token>
```

### Get Weekly Report
```http
GET /reports/weekly
Authorization: Bearer <token>
```

### Get Monthly Report
```http
GET /reports/monthly
Authorization: Bearer <token>
```

---

## User Management (Admin)

### Get All Users
```http
GET /admin/users
Authorization: Bearer <token>
```

### Create User
```http
POST /admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "password": "Password@123",
  "fullName": "New User",
  "email": "newuser@email.com",
  "role": "AGENT"
}
```

### Toggle User Status
```http
PATCH /admin/users/{id}/toggle-status
Authorization: Bearer <token>
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": {
    "cnic": "CNIC format is invalid"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Unprocessable Entity |
| 500 | Internal Server Error |

---

## Rate Limiting

- **Authenticated requests:** 1000 requests per hour
- **Login attempts:** 5 per 15 minutes per IP
