# API Testing Guide

## Using Postman

### 1. Authentication Flow

#### Register
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@test.com",
  "password": "password123",
  "role": "citizen"
}
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@test.com",
    "role": "citizen",
    "trustScore": 100
  }
}
```

#### Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@test.com",
  "password": "password123"
}
```

#### Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer <TOKEN>
```

---

## 2. Complaint Operations

### Create Complaint
```
POST http://localhost:5000/api/complaints
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Fields:
- title: "Water supply issue in sector 5"
- description: "No water for 3 days in our area"
- category: "Water Supply"
- location: "Sector 5, Block A"
- image: <file>
```

### List Complaints
```
GET http://localhost:5000/api/complaints
Authorization: Bearer <TOKEN>

Query Parameters:
- status=Open
- category=Water Supply
- page=1
- limit=10
```

### Get Complaint Details
```
GET http://localhost:5000/api/complaints/:complaintId
Authorization: Bearer <TOKEN>
```

### Support Complaint
```
POST http://localhost:5000/api/complaints/:complaintId/support
Authorization: Bearer <TOKEN>
Content-Type: application/json

{}
```

### Update Complaint Status (Officer)
```
PUT http://localhost:5000/api/complaints/:complaintId
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "status": "In Progress",
  "resolutionNotes": "Team dispatched to site"
}
```

---

## 3. Admin Operations

### Create Officer
```
POST http://localhost:5000/api/admin/officers
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "Officer Smith",
  "email": "smith@test.com",
  "password": "password123",
  "department": "Water Supply",
  "authorityLevel": 1
}
```

### Create SLA Rule
```
POST http://localhost:5000/api/admin/sla-rules
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "category": "Water Supply",
  "timeLimitInHours": 48,
  "department": "Water Supply",
  "escalationPolicy": {
    "level1to2": 24,
    "level2to3": 48,
    "level3toAdmin": 72
  },
  "priority": "High"
}
```

### Get Analytics
```
GET http://localhost:5000/api/admin/analytics
Authorization: Bearer <ADMIN_TOKEN>
```

### Reassign Complaint
```
PUT http://localhost:5000/api/admin/complaints/:complaintId/reassign
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "assignToOfficerId": "officer_id"
}
```

### Get Escalation Report
```
GET http://localhost:5000/api/admin/escalation-report
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 4. Error Handling Examples

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "User role 'citizen' is not authorized to access this route"
}
```

### Duplicate Complaint
```json
{
  "success": false,
  "message": "A similar complaint already exists in this location",
  "duplicateComplaintId": "...",
  "duplicateComplaintTitle": "...",
  "duplicateComplaintStatus": "Open",
  "suggestion": "You can support the existing complaint instead of creating a duplicate"
}
```

---

## 5. Testing Escalation

### Step-by-step
1. Create complaint with future deadline
2. Manually update complaint deadline to past
3. Wait for cron to run (every 5 minutes) or restart backend
4. Check complaint status - should be "Escalated"
5. Check escalationHistory - should have entry
6. Check escalationLevel - should increment

---

## 6. Postman Environment Setup

```json
{
  "id": "...",
  "name": "Grievance System",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api",
      "enabled": true
    },
    {
      "key": "token",
      "value": "eyJhbGciOiJIUzI1NiIs...",
      "enabled": true
    },
    {
      "key": "admin_token",
      "value": "admin_token_here",
      "enabled": true
    },
    {
      "key": "officer_token",
      "value": "officer_token_here",
      "enabled": true
    }
  ]
}
```

Use `{{base_url}}` and `{{token}}` in requests.

---

## 7. Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Not authorized" error | Check token in Authorization header |
| CORS error | Verify CORS_ORIGIN in .env matches frontend URL |
| MongoDB connection error | Ensure MongoDB is running on localhost:27017 |
| File upload fails | Check Content-Type is multipart/form-data |
| Token expired | Login again to get new token |
| Escalation not triggering | Check MongoDB for complaint with past deadline |

