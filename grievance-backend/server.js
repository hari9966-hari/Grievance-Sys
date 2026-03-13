require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorHandler');
const { startEscalationEngine } = require('./cron/escalationEngine');
const { startDailyAnalyticsJob } = require('./cron/dailyAnalytics');

// Routes
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express App
const app = express();

/**
 * Middleware Setup
 */

// CORS (Must be before all other middleware including Helmet and Rate Limiters)
const allowedOrigins = [
  'http://localhost:3000',
  'https://grievance-system-9jwrwiyin-harish-c-09-04.vercel.app',
  'https://grievance-system-e1vefgnc1-harish-c-09-04.vercel.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow localhost and specified vercel preview deployments
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With']
  })
);

// Pre-flight OPTIONS handler for all routes explicitly
app.options('*', cors());

// Security Middleware (Must be after CORS)
// Allow cross-origin for development/debugging 502s
app.use(helmet({ 
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

app.use('/api/', limiter);

// Strict rate limit for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  skipSuccessfulRequests: true
});

/**
 * Connect Database
 */
connectDB();

/**
 * Start Escalation Engine
 */
console.log('Starting escalation engine...');
startEscalationEngine();
console.log('Starting daily analytics job...');
startDailyAnalyticsJob();

/**
 * API Routes
 */

// Health Check
app.get('/api/health', (req, res) => {
  res.setHeader('X-Deployment-Version', 'V1.0.9-FORCED-BYPASS');
  res.status(200).json({
    success: true,
    message: 'Server is running - V1.0.9 (No Email Check)',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes
app.use('/api/auth', authLimiter, authRoutes);

// Complaint Routes
app.use('/api/complaints', complaintRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/**
 * Global Error Handler
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║     Grievance Resolution & Accountability System          ║
║                    Backend Server                         ║
╠═══════════════════════════════════════════════════════════╣
║  Port: ${PORT} | Mode: ${process.env.NODE_ENV || 'production'}
║  Status: ONLINE | Database: CONNECTED
║  Escalation Engine: ACTIVE (every 5 mins)
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
