# 📋 Project Overview & Quick Reference

## 🎯 System at a Glance

```
GRIEVANCE RESOLUTION SYSTEM
├─ Frontend (React)         → Backend (Node.js)    → Database (MongoDB)
│  - 3 Dashboards          - 40+ API endpoints      - 3 Collections
│  - 6+ Pages              - Complete CRUD ops      - Escalation tracking
│  - Auth & Protection     - Duplicate detection    - Image hashing
│  - Charts & Stats        - Auto escalation        - Trust scores
│  - File uploads          - Admin controls         - SLA management
│
└─ Real-time Escalation Engine (runs every 5 minutes)
   Automatically escalates overdue complaints to higher authority
```

---

## 📊 Feature Matrix

| Feature | Citizen | Officer | Admin | Status |
|---------|---------|---------|-------|--------|
| Create Complaints | ✅ | ❌ | ❌ | Complete |
| Support Complaints | ✅ | ❌ | ❌ | Complete |
| Upload Images | ✅ | ✅ | ✅ | Complete |
| View Dashboard | ✅ | ✅ | ✅ | Complete |
| Update Status | ❌ | ✅ | ✅ | Complete |
| Add Resolution | ❌ | ✅ | ✅ | Complete |
| View Analytics | ❌ | ✅ | ✅ | Complete |
| Manage Officers | ❌ | ❌ | ✅ | Complete |
| Define SLAs | ❌ | ❌ | ✅ | Complete |
| Reassign Complaints | ❌ | ❌ | ✅ | Complete |
| View Escalations | ❌ | ✅ | ✅ | Complete |
| Penalize Users | ❌ | ❌ | ✅ | Complete |

---

## 🔄 Complaint Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│ Citizen creates complaint                                   │
│ - Title, description, category, location                   │
│ - Upload proof image (SHA256 hash generated)               │
│ - System checks for duplicates (>70% similarity)           │
│ - Trust score incremented (+5)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Status: OPEN                                                │
│ Assigned to first available officer based on workload      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Status: VERIFIED                                            │
│ Officer verifies complaint authenticity                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Status: IN PROGRESS                                         │
│ Officer works on resolution                                 │
│ SLA Deadline: NOW + Category Time Limit                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼ (Before deadline)     ▼ (After deadline)
    ┌──────────────┐         ┌──────────────────┐
    │ RESOLVED     │         │ ESCALATED        │
    │ By officer   │         │ To higher level  │
    │ Trust+5      │         │ Auto-assigned    │
    └──────┬───────┘         │ New deadline     │
           │                 │ Level++          │
           │                 └─────┬────────────┘
           │                       │
           │                       ▼
           │              (Repeats escalation
           │               until resolved)
           │
           └───────────┬───────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Status: CLOSED                                              │
│ Complaint resolved or force-closed by admin                 │
│ Archive in history                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 User Roles Overview

### 👤 CITIZEN
**Can:**
- Register & login
- Create complaints
- Upload proof images
- Track complaint status
- View personal dashboard
- Support existing complaints
- View complaint history

**Cannot:**
- Update complaint status
- Manage officers
- Access admin functions

**Trust Score:**
- Starts: 100
- Valid complaint: +5
- Fake complaint: -20

---

### 👨‍💼 OFFICER
**Can:**
- View assigned complaints
- Update complaint status
- Add resolution notes
- View performance stats
- See SLA countdown
- Upload resolution proof
- View escalation history

**Cannot:**
- Create new complaints
- Create other officers
- Access analytics
- Modify SLA rules

**Levels:**
- Level 1: First responder
- Level 2: Senior officer
- Level 3: Super admin

---

### 👨‍💻 ADMIN
**Can:**
- All officer capabilities
- Create/manage officers
- Define SLA rules
- View analytics & reports
- Reassign complaints
- Force close complaints
- Penalize users (reduce trust)
- View escalation reports
- Access all dashboards

**Cannot:**
- Create regular complaints as citizen

---

## ⏰ Escalation Timeline Example

```
WATER SUPPLY COMPLAINT
├─ Initial SLA: 48 hours
│
├─ Level 0 (Open)
│  └─ Deadline: NOW + 48 hours
│
├─ After 24 hours (deadline approaching)
│  └─ ESCALATE to Level 1 Officer
│     └─ New deadline: NOW + 48 hours
│
├─ After 48 more hours (no resolution)
│  └─ ESCALATE to Level 2 Officer
│     └─ New deadline: NOW + 72 hours
│     └─ Priority: HIGH
│
├─ After 72 more hours (still pending)
│  └─ ESCALATE to Level 3 (Admin)
│     └─ New deadline: NOW + 72 hours
│     └─ Priority: CRITICAL
│
└─ Must be resolved within final deadline
```

---

## 🔐 Authentication Flow

```
1. USER REGISTERS
   ├─ POST /api/auth/register
   ├─ Body: { name, email, password, role, department? }
   └─ Response: { token, user }

2. JWT TOKEN GENERATED
   ├─ Algorithm: HS256
   ├─ Payload: { id, iat, exp }
   ├─ Secret: From .env
   └─ Expiry: 7 days

3. USER LOGIN
   ├─ POST /api/auth/login
   ├─ Body: { email, password }
   ├─ Password verified with bcryptjs
   ├─ Token returned
   └─ Stored in browser cookies

4. PROTECTED REQUEST
   ├─ Header: Authorization: Bearer <TOKEN>
   ├─ Middleware verifies JWT signature
   ├─ Checks token expiration
   ├─ Retrieves user from database
   └─ Attaches user to request (req.user)

5. ROLE-BASED ACCESS
   ├─ Check req.user.role
   ├─ Compare with required roles
   ├─ Allow/deny access accordingly
   └─ Return 403 if unauthorized
```

---

## 🗄️ Database Schema Summary

```
USERS
├─ _id: ObjectId
├─ name, email, password
├─ role: 'citizen' | 'officer' | 'admin'
├─ authorityLevel: 0-3
├─ trustScore: 0-100
├─ department: String
├─ emailVerified: Boolean
├─ openComplaintCount: Number
├─ resolvedComplaintCount: Number
└─ timestamps

COMPLAINTS
├─ _id: ObjectId
├─ title, description, category, location
├─ createdBy: UserId
├─ assignedTo: UserId (Officer)
├─ status: 'Open' | 'Verified' | 'In Progress' | 'Resolved' | 'Escalated'
├─ slaDeadline: Date
├─ escalationLevel: 0-3
├─ escalationHistory: [ { timestamp, fromLevel, toLevel, reason, assignedTo, newDeadline } ]
├─ supporters: [ { userId, supportedAt } ]
├─ duplicateCount: Number
├─ linkedDuplicateId: ComplaintId
├─ image: String (path)
├─ imageHash: String (SHA256)
├─ isRecurring: Boolean
├─ previousComplaintId: ComplaintId
├─ occurrenceCount: Number
├─ resolutionProof: String
├─ resolutionNotes: String
├─ resolvedAt: Date
├─ resolvedBy: UserId
├─ priority: 'Low' | 'Medium' | 'High' | 'Critical'
├─ isFake: Boolean
└─ timestamps

SLARULES
├─ _id: ObjectId
├─ category: String (unique)
├─ timeLimitInHours: Number
├─ department: String
├─ escalationPolicy:
│  ├─ level1to2: Number (hours)
│  ├─ level2to3: Number (hours)
│  └─ level3toAdmin: Number (hours)
├─ priority: String
├─ isActive: Boolean
└─ timestamps
```

---

## 🧮 Algorithm: Duplicate Detection

```javascript
LEVENSHTEIN DISTANCE ALGORITHM

Input: String1 (existing complaint), String2 (new complaint)

1. Create matrix M[len1+1][len2+1]
2. Initialize first row: 0,1,2,3...
3. Initialize first column: 0,1,2,3...

4. For each cell (i,j):
   IF string1[i-1] == string2[j-1]:
     M[i][j] = M[i-1][j-1]
   ELSE:
     M[i][j] = 1 + MIN(
       M[i-1][j],      // deletion
       M[i][j-1],      // insertion
       M[i-1][j-1]     // substitution
     )

5. Calculate similarity:
   similarity = ((max_len - M[len1][len2]) / max_len) * 100

6. IF similarity > 70%:
   Mark as DUPLICATE
ELSE:
   Allow creation
```

---

## 🔄 Escalation Engine (Cron Job)

```javascript
RUNS EVERY 5 MINUTES

1. Query complaints where:
   - status IN ('Open', 'Verified', 'In Progress')
   - slaDeadline < NOW

2. For each overdue complaint:
   
   a. Get current escalationLevel
   b. Calculate newLevel = min(level + 1, 3)
   
   c. Get SLA rule for category
   d. Get escalation hours for this level
   e. Calculate newDeadline = NOW + hours
   
   f. Find officer with:
      - authorityLevel >= newLevel
      - Least workload
      - Same department
   
   g. Create escalationHistory entry:
      {
        timestamp: NOW,
        fromLevel: oldLevel,
        toLevel: newLevel,
        reason: 'SLA Deadline Exceeded',
        assignedTo: newOfficerId,
        newDeadline: newDeadline
      }
   
   h. Update complaint:
      - escalationLevel = newLevel
      - slaDeadline = newDeadline
      - status = 'Escalated'
      - assignedTo = newOfficer
      - priority = 'Critical' (if level 3)

3. Log results
```

---

## 📈 Analytics Dashboard Data

```
KEY METRICS
├─ Total Complaints: COUNT(*)
├─ Resolved: COUNT(status='Resolved')
├─ Escalated: COUNT(status='Escalated')
├─ Pending: COUNT(status IN ('Open','Verified','In Progress'))
└─ Resolution Rate: (Resolved / Total) * 100

DEPARTMENT PERFORMANCE
├─ Total per category
├─ Resolved per category
├─ Escalated per category
└─ Avg resolution time

OFFICER PERFORMANCE
├─ Complaints assigned
├─ Complaints resolved
├─ Performance score: Resolved / (Resolved + Open)
├─ Open complaint count (workload)
└─ Rating

RECURRING ISSUES
├─ Count of recurring complaints
├─ Top locations
├─ Top categories
└─ Occurrence count
```

---

## 🚀 Deployment Checklist

```
PRE-DEPLOYMENT
□ Update .env with production values
□ Run database seeding
□ Test all API endpoints
□ Verify image upload works
□ Test escalation manually
□ Check database indexes
□ Review security settings

BACKEND DEPLOYMENT
□ Build application
□ Set environment variables
□ Connect to MongoDB Atlas
□ Configure CORS
□ Enable HTTPS
□ Set up logging
□ Test health endpoint

FRONTEND DEPLOYMENT
□ Build React app
□ Set API_URL to production
□ Configure analytics
□ Test all pages
□ Check mobile responsiveness
□ Verify authentication flow

POST-DEPLOYMENT
□ Monitor error logs
□ Check database performance
□ Verify cron jobs running
□ Test backup procedure
□ Monitor user signups
□ Track API response times
```

---

## 💡 Quick Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/expired token | Login again, check cookie |
| 403 Forbidden | Wrong role/authority | Use correct user type |
| 500 Server Error | Backend exception | Check server logs |
| CORS Error | Wrong origin | Update CORS_ORIGIN in .env |
| MongoDB error | Connection failed | Check connection string |
| Escalation not running | Cron not started | Restart backend |
| Upload fails | File too large | Check file size < 5MB |
| Duplicate not detected | Low similarity | Try more similar complaint |

---

## 📞 Getting Help

1. **Read Documentation**
   - README.md - Overview
   - API_TESTING.md - Endpoint examples
   - DEPLOYMENT.md - Production setup

2. **Check Code Comments**
   - All functions documented
   - Inline explanations provided

3. **Test with Postman**
   - Import API endpoints
   - Use demo credentials
   - Debug API issues

4. **Review Logs**
   - Backend: Check console output
   - Frontend: Check browser console
   - Database: Check MongoDB logs

---

## 📦 Directory Navigation

```
Root Directory (EE-8)
├─ grievance-backend/       → All backend code
├─ grievance-frontend/      → All frontend code
├─ README.md               → Start here!
├─ API_TESTING.md          → Test endpoints
├─ DEPLOYMENT.md           → Deploy to production
├─ TECHNICAL_SPECS.md      → Architecture details
├─ COMPLETION_SUMMARY.md   → Project summary
├─ seed-db.js              → Seed demo data
└─ setup.sh                → Initial setup
```

---

## ✨ Quick Start (3 Steps)

```bash
# Step 1: Setup Backend
cd grievance-backend
npm install
cp .env.example .env
npm run dev

# Step 2: Setup Frontend (new terminal)
cd grievance-frontend
npm install
npm start

# Step 3: Open Browser
# Frontend:  http://localhost:3000
# Login:     citizen@test.com / password
```

---

**Last Updated**: February 23, 2026
**Status**: ✅ Production Ready
**Version**: 1.0.0

---
