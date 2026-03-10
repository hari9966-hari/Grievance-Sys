# Time-Bound Grievance Resolution & Accountability System

A full-stack web application for managing citizen complaints with automatic escalation, duplicate detection, and performance tracking.

## 🎯 Project Overview

This system enables:
- **Citizens** to raise complaints with proof images
- **Officers** to manage and resolve complaints within SLA deadlines
- **Admins** to oversee operations and manage escalations
- **Automatic escalation** when SLAs are breached
- **Duplicate detection** to prevent spam complaints
- **Accountability tracking** through escalation history

## 🏗️ Architecture

```
grievance-backend/          # Node.js/Express Backend
├── models/                 # Mongoose schemas (User, Complaint, SLARule)
├── controllers/            # Business logic (auth, complaint, admin)
├── routes/                 # API endpoints
├── middleware/             # Auth, validation, error handling
├── cron/                   # Escalation engine
├── utils/                  # Hash utilities, token utils
├── config/                 # Database configuration
├── server.js              # Main server file
└── package.json

grievance-frontend/         # React.js Frontend
├── src/
│   ├── pages/             # CitizenDashboard, OfficerDashboard, AdminDashboard, etc.
│   ├── components/        # ProtectedRoute, Navigation, Stats components
│   ├── context/           # AuthContext for state management
│   ├── services/          # API calls (axiosConfig, api.js)
│   ├── utils/             # Utility functions
│   ├── App.js             # Main routing
│   ├── index.js           # Entry point
│   └── index.css          # Tailwind styles
├── public/
│   └── index.html         # HTML template
├── package.json
└── tailwind.config.js
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- MongoDB installed and running
- Git

### Backend Setup

```bash
cd grievance-backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start MongoDB (if running locally)
# mongod

# Start server
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd grievance-frontend

# Install dependencies
npm install

# Start development server
npm start
# Frontend runs on http://localhost:3000
```

## 🔧 Configuration

### Backend .env
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grievance-system
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Database Initialization

Run the backend server first, then seed demo data using MongoDB client:

```javascript
db.users.insertMany([
  {
    name: "Admin User",
    email: "admin@test.com",
    password: "hashed_password", // Use bcryptjs to hash
    role: "admin",
    authorityLevel: 3,
    emailVerified: true,
    trustScore: 100
  },
  {
    name: "Officer Demo",
    email: "officer@test.com",
    role: "officer",
    department: "Water Supply",
    authorityLevel: 1,
    emailVerified: true,
    trustScore: 100
  },
  {
    name: "Citizen Demo",
    email: "citizen@test.com",
    role: "citizen",
    authorityLevel: 0,
    emailVerified: true,
    trustScore: 100
  }
])

db.slarules.insertMany([
  {
    category: "Water Supply",
    timeLimitInHours: 48,
    department: "Water Supply",
    escalationPolicy: {
      level1to2: 24,
      level2to3: 48,
      level3toAdmin: 72
    },
    priority: "High"
  }
])
```

## 📊 Core Features

### 1. Complaint Management
- Create complaints with image uploads
- Automatic duplicate detection (>70% similarity)
- Support existing complaints instead of creating duplicates
- Track complaint lifecycle: Open → Verified → In Progress → Resolved

### 2. SLA & Escalation Engine
- **Runs every 5 minutes** via node-cron
- Automatically escalates overdue complaints
- Updates deadline after each escalation
- Maintains complete escalation history
- Escalation path: Level 1 → Level 2 → Level 3 → Admin

### 3. Image Hashing
- SHA256 hash for all uploaded images
- Detects duplicate image submissions
- Helps identify spam/fake complaints

### 4. Duplicate Detection
- Compares new complaints with recent ones (last 7 days)
- Uses Levenshtein distance algorithm
- >70% similarity triggers duplicate warning
- Allows user to "support" existing complaint

### 5. Trust Score System
- Citizens start with 100 points
- **+5** for each valid complaint
- **-20** for each fake complaint (marked by admin)
- Low trust score requires admin approval for new complaints

### 6. Recurring Issue Tracking
- Detects when same category + location issue happens again
- Links to previous complaint
- Auto-marks as High Priority if occurs >3 times

### 7. Officer Workload Management
- New complaints auto-assigned to officer with least workload
- Escalation considers authority level
- Performance metrics calculated

### 8. Admin Controls
- Create/manage officers
- Define SLA rules per category
- Reassign complaints
- Force close complaints
- Penalize users
- View analytics and escalation reports

## 🔐 Authentication & Authorization

### JWT-based Authentication
```javascript
// Headers required for protected routes
Authorization: Bearer <JWT_TOKEN>
```

### Role-based Access Control
```
Citizen (role: 'citizen')
  ├─ Create complaints
  ├─ View own complaints
  ├─ Support other complaints
  └─ View dashboard

Officer (role: 'officer', authorityLevel: 1-3)
  ├─ View assigned complaints
  ├─ Update status
  ├─ View performance stats
  └─ See SLA countdown

Admin (role: 'admin', authorityLevel: 3)
  ├─ All officer permissions
  ├─ Manage officers
  ├─ Define SLAs
  ├─ View analytics
  ├─ Force close complaints
  └─ Penalize users
```

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
GET    /api/auth/me                # Get current user
PUT    /api/auth/update-profile    # Update profile
POST   /api/auth/verify-email      # Verify email
GET    /api/auth/stats             # Get user statistics
```

### Complaints
```
POST   /api/complaints             # Create complaint
GET    /api/complaints             # List complaints
GET    /api/complaints/:id         # Get complaint details
PUT    /api/complaints/:id         # Update complaint status
POST   /api/complaints/:id/support # Support complaint
GET    /api/complaints/stats/dashboard # Get statistics
POST   /api/complaints/:id/mark-fake   # Mark as fake (admin)
```

### Admin
```
POST   /api/admin/officers                    # Create officer
GET    /api/admin/officers                    # List officers
PUT    /api/admin/officers/:id                # Update officer
DELETE /api/admin/officers/:id                # Delete officer

POST   /api/admin/sla-rules                   # Create/update SLA
GET    /api/admin/sla-rules                   # Get SLA rules

PUT    /api/admin/complaints/:id/reassign     # Reassign complaint
PUT    /api/admin/complaints/:id/force-close  # Force close complaint

GET    /api/admin/analytics                   # Get analytics
GET    /api/admin/escalation-report           # Get escalation report
POST   /api/admin/users/:id/penalize          # Penalize user
```

## 🗄️ Database Schemas

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'citizen' | 'officer' | 'admin',
  department: String,
  authorityLevel: 0-3,
  trustScore: 0-100,
  emailVerified: Boolean,
  openComplaintCount: Number,
  resolvedComplaintCount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Complaint Schema
```javascript
{
  title: String,
  description: String,
  category: String,
  location: String,
  createdBy: ObjectId (User),
  assignedTo: ObjectId (User),
  status: 'Open' | 'Verified' | 'In Progress' | 'Resolved' | 'Escalated' | 'Closed',
  
  // SLA Management
  slaDeadline: Date,
  escalationLevel: 0-3,
  escalationHistory: [{
    timestamp: Date,
    fromLevel: Number,
    toLevel: Number,
    reason: String,
    assignedTo: ObjectId (User),
    newDeadline: Date
  }],
  
  // Duplicate & Support
  supporters: [{ userId, supportedAt }],
  duplicateCount: Number,
  linkedDuplicateId: ObjectId,
  
  // Image Handling
  image: String (path),
  imageHash: String,
  previousImageHashes: [String],
  
  // Recurring Issues
  isRecurring: Boolean,
  previousComplaintId: ObjectId,
  occurrenceCount: Number,
  
  // Resolution
  resolutionProof: String,
  resolutionNotes: String,
  resolvedAt: Date,
  resolvedBy: ObjectId (User),
  
  priority: 'Low' | 'Medium' | 'High' | 'Critical',
  isFake: Boolean,
  fakeReportCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### SLA Rule Schema
```javascript
{
  category: String (unique),
  timeLimitInHours: Number,
  department: String,
  escalationPolicy: {
    level1to2: Number,
    level2to3: Number,
    level3toAdmin: Number
  },
  priority: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔄 Escalation Process

The cron job runs **every 5 minutes** and:

1. **Finds** all unresolved complaints past their deadline
2. **Increments** escalation level (0→1→2→3)
3. **Updates** status to 'Escalated'
4. **Assigns** to higher authority officer
5. **Sets** new shorter deadline based on escalation policy
6. **Logs** complete history in escalationHistory array

### Escalation Timeline Example
```
Initial SLA: 48 hours (Level 0)
  ↓ (after 24 hours) → Level 1 escalation, new deadline: 48 hours
  ↓ (after 48 hours) → Level 2 escalation, new deadline: 72 hours
  ↓ (after 72 hours) → Level 3/Admin escalation, marked Critical
```

## 📈 Analytics & Reports

### Dashboard Statistics
- Total complaints
- Resolved count
- Pending count
- Escalated count
- Complaints by category
- Resolution rate
- Average resolution time

### Officer Performance
- Complaints assigned
- Complaints resolved
- Performance score
- Open complaint workload

### Escalation Reports
- Count by escalation level
- List of all escalated complaints
- Officer workload distribution
- SLA breach statistics

## 🧪 Testing

### Manual Testing Steps

1. **Register as Citizen**
   - Create account with email
   - Verify email
   - Create complaint with image
   - View dashboard

2. **Register as Officer**
   - Create account (needs admin)
   - View assigned complaints
   - Update status
   - Add resolution notes

3. **Login as Admin**
   - View analytics
   - Create/manage officers
   - Define SLA rules
   - Reassign complaints
   - View escalation reports

### Demo Credentials
```
Admin:   admin@test.com / password
Officer: officer@test.com / password
Citizen: citizen@test.com / password
```

## 🔒 Security Features

- **JWT Authentication** with 7-day expiration
- **Password Hashing** using bcryptjs (10 salt rounds)
- **Role-based Access Control** on all routes
- **Input Validation** using express-validator
- **Rate Limiting** (100 req/15min for general, 5 req/15min for auth)
- **CORS** enabled for specific origin
- **Helmet** middleware for security headers
- **File Upload** validation (images only, 5MB limit)

## 📱 Frontend Components

### Pages
- **LoginPage** - Authentication form
- **RegisterPage** - User registration
- **CitizenDashboard** - Complaint statistics and timeline
- **CreateComplaint** - Form with duplicate detection UI
- **OfficerDashboard** - Assigned complaints with SLA countdown
- **AdminDashboard** - Analytics and performance metrics

### Components
- **Navigation** - Role-based navigation bar
- **ProtectedRoute** - Role-based route protection
- **StatCard** - Reusable statistics card

## 🎨 UI/UX Design

- **Tailwind CSS** for responsive design
- **Recharts** for data visualization
- **React Icons** for UI elements
- **Role-specific** dashboards
- **Mobile responsive** layout
- **Real-time** status indicators

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/grievance-system
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=5000000
ESCALATION_CHECK_INTERVAL=*/5 * * * *
MIN_TRUST_SCORE_FOR_COMPLAINTS=0
MAX_OPEN_COMPLAINTS_PER_USER=3
FAKE_COMPLAINT_PENALTY=-20
VALID_COMPLAINT_BONUS=5
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ORM
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **node-cron** - Scheduled tasks
- **multer** - File uploads
- **dotenv** - Environment variables
- **cors** - Cross-origin support
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **recharts** - Charts
- **react-icons** - Icons
- **date-fns** - Date formatting
- **js-cookie** - Cookie management

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables
DATABASE_URL=<mongodb_atlas_uri>
JWT_SECRET=<strong_secret>

# Deploy
npm install
npm start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy build folder
# Set API URL to production backend
```

## 📚 Project Structure Summary

```
✅ Complete backend with all features
✅ JWT authentication & authorization
✅ Automatic SLA escalation engine
✅ Duplicate detection algorithm
✅ Image hashing for spam prevention
✅ Trust score system
✅ Recurring issue tracking
✅ Complete escalation history
✅ Role-based dashboards
✅ Analytics & reports
✅ Admin management panel
✅ Responsive UI with Tailwind CSS
✅ API documentation
✅ Error handling & validation
✅ Rate limiting & security
```

## 🎓 Learning Outcomes

This project demonstrates:
- **Full-stack development** with Node.js and React
- **Database design** with Mongoose
- **Authentication** with JWT
- **Authorization** with role-based access
- **Scheduled tasks** with cron jobs
- **API design** following REST principles
- **Error handling** and validation
- **State management** with React Context
- **Real-time dashboards** with data visualization
- **File upload** handling
- **Security best practices**

## 📞 Support & Contact

For issues, questions, or improvements:
1. Check documentation
2. Review existing code comments
3. Test API endpoints with Postman
4. Check browser console for frontend errors
5. Check server logs for backend errors

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ for modern e-governance systems**
