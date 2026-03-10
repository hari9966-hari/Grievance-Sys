# Technical Specifications

## System Architecture

### Technology Stack
- **Frontend**: React 18, Tailwind CSS, Recharts, React Router
- **Backend**: Node.js, Express 4.18, Mongoose 7
- **Database**: MongoDB
- **Authentication**: JWT
- **File Handling**: Multer
- **Scheduling**: node-cron
- **Security**: Helmet, bcryptjs, express-rate-limit

### System Diagram

```
┌─────────────┐                                    ┌──────────────┐
│   User      │                                    │  File Store  │
│  Interface  │                                    │  (Images)    │
└──────┬──────┘                                    └──────┬───────┘
       │                                                   │
       │ HTTP/HTTPS                                       │ Upload
       │                                                   │
┌──────▼──────────────────────────────────────────────────▼───────┐
│                      React Frontend                              │
│  ┌──────────────┐  ┌────────────────┐  ┌────────────────────┐  │
│  │ Auth Pages   │  │ Dashboards     │  │ Components Library │  │
│  │ (Login/Reg)  │  │ (Citizen/etc)  │  │ (Charts, Forms)    │  │
│  └──────────────┘  └────────────────┘  └────────────────────┘  │
└──────┬──────────────────────────────────────────────────────────┘
       │
       │ API Calls (REST)
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                   Express Backend (Node.js)                      │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Middleware Layer                                         │   │
│ │ ├─ JWT Authentication    ├─ Rate Limiting              │   │
│ │ ├─ CORS                  ├─ Error Handling             │   │
│ │ ├─ Helmet                ├─ Request Validation         │   │
│ │ └─ Body Parser           └─ File Upload                │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Route Handlers                                           │   │
│ │ ├─ /api/auth/*         (Authentication)                 │   │
│ │ ├─ /api/complaints/*   (Complaint CRUD)                 │   │
│ │ └─ /api/admin/*        (Admin Operations)               │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Controllers & Business Logic                             │   │
│ │ ├─ authController      (User auth logic)                 │   │
│ │ ├─ complaintController (Complaint handling)              │   │
│ │ └─ adminController     (Admin functions)                 │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Cron Jobs & Scheduled Tasks                              │   │
│ │ ├─ Escalation Engine (every 5 minutes)                   │   │
│ │ ├─ Recurring Issue Detection                             │   │
│ │ └─ Notification System                                   │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Utilities                                                │   │
│ │ ├─ Hash Utilities (SHA256)                               │   │
│ │ ├─ Token Utilities (JWT)                                 │   │
│ │ └─ Similarity Algorithm (Levenshtein)                    │   │
│ └──────────────────────────────────────────────────────────┘   │
└──────┬──────────────────────────────────────────────────────────┘
       │
       │ Mongoose ODM
       │
┌──────▼──────────────────────────────────────────────────────────┐
│                      MongoDB Database                            │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Collections                                              │   │
│ │ ├─ users (auth, roles, trust score)                      │   │
│ │ ├─ complaints (grievances, escalation, SLA)             │   │
│ │ └─ slarules (SLA timelines per category)                 │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ Indexes                                                  │   │
│ │ ├─ users: { email: 1 }                                   │   │
│ │ ├─ complaints: { createdBy, status, slaDeadline, etc }  │   │
│ │ └─ slarules: { category: 1 }                             │   │
│ └──────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Examples

### 1. Complaint Creation Flow

```
User Input (Form)
    ↓
Frontend validates input
    ↓
Checks for duplicates (API call)
    ↓
Shows duplicate warning (if exists)
    ↓
User confirms or supports existing
    ↓
Create complaint (multipart form-data)
    ↓
Backend receives request
    ↓
Authentication middleware validates JWT
    ↓
Validation middleware checks fields
    ↓
Controller receives request
    ↓
Query similar complaints (last 7 days)
    ↓
Calculate similarity (>70% = duplicate)
    ↓
If duplicate → return error with duplicate details
    ↓
Get SLA rule for category
    ↓
Calculate deadline = now + SLA hours
    ↓
Generate image hash (SHA256)
    ↓
Check for previous use of image hash
    ↓
Save complaint to MongoDB
    ↓
Update user open complaint count
    ↓
Increment user trust score
    ↓
Return success with complaint details
```

### 2. SLA Escalation Flow

```
Cron Job Triggers (every 5 minutes)
    ↓
Query unresolved complaints with past deadline
    ↓
For each complaint:
    ├─ Get current escalation level
    ├─ Increment to next level (max 3)
    ├─ Get SLA rule for category
    ├─ Get escalation timeline for this level
    ├─ Calculate new deadline
    ├─ Find officer for next authority level
    ├─ Create escalation history entry
    ├─ Update complaint:
    │  ├─ escalationLevel++
    │  ├─ slaDeadline = new deadline
    │  ├─ status = "Escalated"
    │  ├─ assignedTo = new officer
    │  ├─ priority update
    │  └─ escalationHistory.push(...)
    └─ Save complaint
    ↓
Log results
    ↓
Next check in 5 minutes
```

### 3. Duplicate Detection Flow

```
Frontend Input: title + description
    ↓
Query similar complaints:
    SELECT * WHERE category=X AND location=Y 
             AND createdAt > 7 days ago
             AND status != "Closed"
    ↓
For each complaint found:
    ├─ Compare: newTitle + newDesc vs oldTitle + oldDesc
    ├─ Calculate Levenshtein distance
    ├─ Convert to similarity percentage
    ├─ If > 70% similarity:
    │  ├─ Mark as duplicate
    │  └─ Return duplicate warning
    └─ Continue to next
    ↓
If any > 70% similar:
    └─ Return error with duplicate details
    ↓
Else:
    └─ Allow complaint creation
```

---

## Database Indexing Strategy

### Users Collection
```javascript
// Fast authentication
db.users.createIndex({ email: 1 })

// Fast role-based queries
db.users.createIndex({ role: 1, authorityLevel: 1 })

// Officer workload
db.users.createIndex({ role: 1, openComplaintCount: 1 })
```

### Complaints Collection
```javascript
// Citizen's complaints
db.complaints.createIndex({ createdBy: 1, status: 1 })

// Officer's assigned complaints
db.complaints.createIndex({ assignedTo: 1, status: 1 })

// Category & location (duplicate detection)
db.complaints.createIndex({ category: 1, location: 1, createdAt: -1 })

// SLA escalation
db.complaints.createIndex({ slaDeadline: 1, status: 1 })

// Image hash lookup
db.complaints.createIndex({ imageHash: 1 })

// Escalation report
db.complaints.createIndex({ escalationLevel: 1, status: 1 })

// Performance analytics
db.complaints.createIndex({ createdBy: 1, status: 1, resolvedAt: 1 })
```

### SLARules Collection
```javascript
// Fast lookup by category
db.slarules.createIndex({ category: 1 })
```

---

## API Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "fieldName", "message": "Error detail" }
  ]
}
```

### Paginated Response
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 100,
  "data": [ /* array of items */ ]
}
```

---

## Performance Metrics

### Expected Response Times
| Endpoint | Expected Time |
|----------|---------------|
| /auth/login | < 200ms |
| /complaints (list) | < 300ms |
| /complaints/:id | < 150ms |
| /complaints (create) | < 500ms |
| /admin/analytics | < 1000ms |

### Database Operations
| Operation | Index Time | No Index Time |
|-----------|-----------|---------------|
| Find by email | < 5ms | > 100ms |
| Find by createdBy | < 10ms | > 200ms |
| Find by category | < 10ms | > 150ms |

---

## Security Features

### Input Validation
```javascript
// All inputs validated before processing
- Email format validation
- Password strength requirements
- String length limits
- Enum values validation
- File type validation
```

### Authentication
```javascript
// JWT Token Structure
Header: { alg: "HS256", typ: "JWT" }
Payload: { id: userId, iat: timestamp, exp: timestamp }
Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)
```

### Authorization Checks
```javascript
// Role-based access control
1. Check if user authenticated (JWT)
2. Verify JWT signature
3. Check token expiration
4. Verify user role matches required role
5. Check authority level if needed
```

### Rate Limiting
```javascript
// 100 requests per 15 minutes (general)
// 5 requests per 15 minutes (authentication)
// Prevents: brute force, DOS, spam
```

### File Upload Security
```javascript
- Only image files accepted
- Maximum 5MB file size
- SHA256 hash generated
- Path not exposed to frontend
- Served through controlled endpoint
```

---

## Scalability Considerations

### Current Architecture
- Single instance backend
- Direct database queries
- In-memory session state
- Single cron job

### Scaling Options

**Horizontal Scaling**
```
Multiple Backend Instances:
├─ Load Balancer (HAProxy, Nginx)
├─ Instance 1 (Port 3001)
├─ Instance 2 (Port 3002)
└─ Instance 3 (Port 3003)
    └─ Shared MongoDB

Redis Cache:
├─ User sessions
├─ Complaint queries
└─ Analytics cache

Message Queue:
├─ Bull/RabbitMQ
├─ Background jobs
└─ Escalation tasks
```

### Database Optimization
```javascript
// Connection Pooling
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5
})

// Read Replicas (MongoDB)
- Primary: Write operations
- Secondary 1: Read replicas
- Secondary 2: Backups

// Sharding by User/Category
- Shard 1: Users A-M
- Shard 2: Users N-Z
- Or shard by category
```

---

## Monitoring & Observability

### Metrics to Track
```
Backend:
- Request count per endpoint
- Response time per endpoint
- Error rate
- Database query time
- Cron job execution time
- Memory usage
- CPU usage

Frontend:
- Page load time
- API call latency
- Error rate
- User interactions
- Browser usage

Database:
- Query count
- Slow queries
- Connection pool status
- Storage usage
- Replication lag
```

### Logging Strategy
```
Backend:
- Cron job starts/ends
- Escalations triggered
- Errors with stack trace
- Slow queries (> 100ms)

Frontend:
- Console errors
- API failures
- User actions
- Performance timing
```

---

## Disaster Recovery

### Backup Strategy
```
Daily:
- MongoDB full backup
- Application logs backup
- Configuration backup

Weekly:
- Offsite backup (S3)
- Database snapshot

Monthly:
- Test restore procedure
- Archive old backups
```

### Recovery Time Objectives
```
RTO (Recovery Time Objective): 4 hours
RPO (Recovery Point Objective): 24 hours
```

### Failover Procedure
```
1. Detect failure (monitoring alert)
2. Activate secondary database
3. Update connection strings
4. Verify data integrity
5. Resume normal operations
6. Post-incident review
```

