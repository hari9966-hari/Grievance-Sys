# Deployment Guide

## Production Deployment

### Prerequisites
- MongoDB Atlas account (or self-hosted MongoDB)
- Node.js hosting (Heroku, Railway, DigitalOcean, AWS, etc.)
- Frontend hosting (Vercel, Netlify, AWS S3)
- Domain name (optional)

---

## MongoDB Atlas Setup

1. **Create Account** at https://www.mongodb.com/cloud/atlas

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier)
   - Select region closest to users
   - Complete setup

3. **Get Connection String**
   - Click "Connect"
   - Choose "Drivers"
   - Copy connection string
   - Replace `<password>` with your database password

4. **Add IP Whitelist**
   - Security → Network Access
   - Add IP Address → Allow From Anywhere (for initial setup)

---

## Backend Deployment (Railway/Heroku)

### Option 1: Railway (Recommended)

1. **Prepare Repository**
   ```bash
   cd grievance-backend
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Deploy to Railway**
   - Connect GitHub account at https://railway.app
   - Select your repository
   - Railway auto-detects Node.js
   - Add PostgreSQL/MongoDB add-on

3. **Set Environment Variables**
   - Go to "Variables" in Railway dashboard
   - Add all variables from `.env`:
     ```
     MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/grievance-system
     JWT_SECRET=<generate_strong_secret>
     JWT_EXPIRE=7d
     NODE_ENV=production
     CORS_ORIGIN=https://yourdomain.com
     ```

4. **Deploy**
   - Railway auto-deploys on push
   - Backend runs on provided URL

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create App**
   ```bash
   cd grievance-backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended)

1. **Build Frontend**
   ```bash
   cd grievance-frontend
   npm run build
   ```

2. **Deploy with Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Set Environment Variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add `REACT_APP_API_URL=https://your-backend-url/api`

4. **Automatic Deployment**
   - Connect GitHub
   - Deploy on every push to main branch

### Option 2: Netlify

1. **Build Frontend**
   ```bash
   cd grievance-frontend
   npm run build
   ```

2. **Deploy**
   - Go to https://netlify.com
   - Drag & drop `build` folder, or
   - Connect GitHub and auto-deploy

3. **Set Environment Variables**
   - Site settings → Build & Deploy → Environment
   - Add `REACT_APP_API_URL`

### Option 3: AWS S3 + CloudFront

1. **Build Frontend**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Upload contents of `build/` folder
   - Enable static website hosting

3. **CloudFront Distribution**
   - Create distribution pointing to S3
   - Set default root object to `index.html`
   - Add custom domain (Route 53)

---

## Domain & SSL Setup

### Using Custom Domain

1. **Update Backend CORS**
   - Set `CORS_ORIGIN=https://yourdomain.com`

2. **Update Frontend API URL**
   - `REACT_APP_API_URL=https://api.yourdomain.com`

3. **DNS Configuration**
   - Point domain to hosting provider
   - Set SSL certificate (auto with most providers)

---

## Database Backups

### MongoDB Atlas
- Automated backups every 12 hours
- Manual backups available
- Point-in-time recovery option

### Backup Locally
```bash
mongodump --uri="mongodb+srv://..." --out=./backup
```

### Restore
```bash
mongorestore --uri="mongodb+srv://..." ./backup
```

---

## Monitoring & Logging

### Backend Monitoring
- **Railway/Heroku Dashboard** - View logs
- **MongoDB Atlas** - Monitor connections and performance
- **Sentry** - Add error tracking:
  ```bash
  npm install @sentry/node
  ```

### Frontend Monitoring
- **Vercel Analytics** - Built-in
- **Google Analytics** - Track user behavior
- **LogRocket** - Session replay

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Set CORS_ORIGIN to your domain
- [ ] Enable MongoDB IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Use HTTPS/SSL
- [ ] Enable rate limiting
- [ ] Set secure cookie flags
- [ ] Regular security updates
- [ ] Monitor error logs
- [ ] Backup database regularly

---

## Performance Optimization

### Backend
```javascript
// Add caching for frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Compress responses
const compression = require('compression');
app.use(compression());

// Database indexes
db.complaints.createIndex({ "createdBy": 1, "status": 1 });
db.complaints.createIndex({ "slaDeadline": 1 });
```

### Frontend
```bash
# Enable code splitting
npm install @loadable/component

# Optimize images
npm install next-image-optimization

# Minify and bundle
npm run build
```

---

## Scaling Strategy

### Vertical Scaling
- Increase server resources (RAM, CPU)
- Upgrade database tier

### Horizontal Scaling
- Multiple backend instances with load balancer
- Use database connection pooling
- Implement caching layer (Redis)
- CDN for static assets

### Cron Job Scaling
- Use separate cron server
- Implement job queue (Bull, RQ)
- Distributed locking mechanism

---

## Troubleshooting

### Backend Won't Connect to DB
```bash
# Check connection string
echo $MONGODB_URI

# Verify IP whitelist in MongoDB Atlas
# Check firewall rules
```

### CORS Errors
- Verify `CORS_ORIGIN` matches frontend URL exactly
- No trailing slashes
- Include protocol (https://)

### Frontend Can't Connect to API
- Check `REACT_APP_API_URL` environment variable
- Verify backend is running
- Check network tab in DevTools

### Escalation Not Running
- Verify cron job logs
- Check MongoDB has correct complaint data
- Restart backend service

---

## Post-Deployment

1. **Test All Features**
   - Register users
   - Create complaints
   - Update status
   - View dashboards

2. **Monitor Logs**
   - Watch for errors
   - Monitor database performance
   - Check API response times

3. **Backup Strategy**
   - Schedule daily backups
   - Test restore procedure
   - Keep 30-day backup retention

4. **Update Cycle**
   - Regular security patches
   - Feature updates
   - Performance optimization

---

## Scaling Example Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel CDN                        │
│              (Frontend - React App)                  │
└────────────────┬────────────────────────────────────┘
                 │ API Calls
┌────────────────▼────────────────────────────────────┐
│              Cloudflare/CloudFront                   │
│           (API Gateway + SSL/TLS)                    │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────┴────────┐
        │                 │
┌───────▼───────┐ ┌──────▼────────┐
│   Backend 1   │ │  Backend 2    │
│   (Railway)   │ │  (Railway)    │
└───────┬───────┘ └──────┬────────┘
        │                 │
        └────────┬────────┘
                 │
         ┌───────▼────────┐
         │  Redis Cache   │
         └────────────────┘
                 │
         ┌───────▼────────┐
         │ MongoDB Atlas  │
         │  (Cluster)     │
         └────────────────┘
                 │
         ┌───────▼────────┐
         │   Backups      │
         └────────────────┘
```

---

## Cost Estimation (AWS/GCP)

| Service | Monthly Cost |
|---------|-------------|
| MongoDB Atlas (M10) | $57 |
| Backend hosting (2 instances) | $60 |
| Frontend CDN | $10-20 |
| Domain name | $0.99 |
| **Total** | **~$130** |

(Prices vary by region and traffic)

---

## Support & Troubleshooting

For deployment issues:
1. Check hosting provider documentation
2. Review application logs
3. Verify environment variables
4. Test locally first
5. Contact hosting provider support
