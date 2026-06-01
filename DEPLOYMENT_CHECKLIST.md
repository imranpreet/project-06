# 🚀 Deployment Checklist

Follow this checklist to deploy your Blog API to production.

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] All code committed to GitHub
- [ ] `.env` file is in `.gitignore`
- [ ] No console.log statements left in production code
- [ ] All error messages are user-friendly
- [ ] Code follows consistent naming conventions

### Security
- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Password validation is working (min 6 chars)
- [ ] Authorization checks are in place
- [ ] CORS_ORIGIN is set to actual frontend URL (not *)
- [ ] No sensitive info in error messages
- [ ] Helmet middleware is enabled
- [ ] Input validation on all endpoints

### Testing
- [ ] Health endpoint returns 200
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create blog post (with token)
- [ ] Can get all blogs (public)
- [ ] Can update own blog
- [ ] Cannot update other user's blog (gets 403)
- [ ] Can delete own blog
- [ ] Invalid token returns 401
- [ ] Missing fields return 400
- [ ] Duplicate email returns error

### Database
- [ ] MongoDB Atlas account created
- [ ] Cluster deployed and running
- [ ] Database user created with strong password
- [ ] Connection string obtained
- [ ] IP whitelist includes all IPs (0.0.0.0/0) for easier testing
- [ ] Test connection works locally

### Documentation
- [ ] README.md has API documentation
- [ ] SETUP.md has local setup instructions
- [ ] TESTING.md has testing examples
- [ ] DEPLOYMENT.md exists with deployment steps
- [ ] Comments added to complex code sections
- [ ] .env.example shows all required variables

---

## 🟢 Deploy to Render (Step-by-Step)

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "Blog API - Initial release"
git remote add origin https://github.com/YOUR_USERNAME/backend2-6.git
git push -u origin main
```

- [ ] Code pushed to GitHub
- [ ] Repository is public
- [ ] All files included (except .env)

### Step 2: Create Render Account
- [ ] Go to https://dashboard.render.com
- [ ] Sign up with GitHub
- [ ] Authorize GitHub access
- [ ] Repository visible in Render dashboard

### Step 3: Create Web Service
- [ ] Click "New" → "Web Service"
- [ ] Select backend2-6 repository
- [ ] Choose "Node" as environment
- [ ] Set name: `blog-api-backend`

### Step 4: Configure Service
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type: Free tier (or Starter for production)

### Step 5: Add Environment Variables
In Render Dashboard → Environment:
- [ ] PORT = 5000
- [ ] NODE_ENV = production
- [ ] MONGODB_URI = <your_mongodb_atlas_uri>
- [ ] JWT_SECRET = <strong_secret_key>
- [ ] JWT_EXPIRE = 7d
- [ ] CORS_ORIGIN = https://<your-frontend-domain>.com

### Step 6: Deploy
- [ ] Click "Deploy" button
- [ ] Wait 5-10 minutes for build
- [ ] Check Logs for errors
- [ ] Verify deployment successful

### Step 7: Test Deployed API
```bash
curl https://blog-api-backend.onrender.com/api/health

# Should return:
# {"status":"OK","timestamp":"...","uptime":...}
```

- [ ] Health endpoint returns 200
- [ ] API is accessible from internet
- [ ] Test register endpoint
- [ ] Test create blog endpoint

### Step 8: Update Frontend
- [ ] Update frontend API base URL to deployed endpoint
- [ ] Update CORS_ORIGIN in Render environment
- [ ] Test frontend connectivity

- [ ] Deployed URL: `https://blog-api-backend.onrender.com`

---

## 🔵 Deploy to Heroku (Step-by-Step)

### Step 1: Install Heroku CLI
```bash
curl https://cli-assets.heroku.com/install.sh | sh
```

- [ ] Heroku CLI installed

### Step 2: Login to Heroku
```bash
heroku login
```

- [ ] Logged in to Heroku account

### Step 3: Create App
```bash
heroku create blog-api-backend
```

- [ ] Heroku app created
- [ ] Note the app URL: `blog-api-backend.herokuapp.com`

### Step 4: Set Environment Variables
```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=<your_mongodb_uri>
heroku config:set JWT_SECRET=<strong_key>
heroku config:set JWT_EXPIRE=7d
heroku config:set CORS_ORIGIN=<frontend_url>
```

- [ ] All environment variables set

### Step 5: Deploy
```bash
git push heroku main
```

- [ ] Build successful
- [ ] Application deployed
- [ ] Check logs: `heroku logs --tail`

### Step 6: Test
```bash
curl https://blog-api-backend.herokuapp.com/api/health
```

- [ ] Health endpoint works
- [ ] API is online

### Step 7: View Logs
```bash
heroku logs -n 50
```

- [ ] No errors in logs
- [ ] Application running smoothly

- [ ] Deployed URL: `https://blog-api-backend.herokuapp.com`

---

## 🟠 Deploy to AWS EC2 (Step-by-Step)

### Step 1: Create EC2 Instance
- [ ] AWS account created
- [ ] EC2 instance launched (Ubuntu 20.04, t2.micro)
- [ ] Security groups configured:
  - [ ] Port 22 (SSH)
  - [ ] Port 80 (HTTP)
  - [ ] Port 443 (HTTPS)
  - [ ] Port 5000 (App)
- [ ] Downloaded .pem key file

### Step 2: Connect to Instance
```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-instance-ip
```

- [ ] Connected to EC2 instance

### Step 3: Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm git -y
```

- [ ] Node.js installed
- [ ] npm installed
- [ ] git installed

### Step 4: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/backend2-6.git
cd backend2-6
npm install
```

- [ ] Repository cloned
- [ ] Dependencies installed

### Step 5: Create .env File
```bash
cat > .env << EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=<your_mongodb_uri>
JWT_SECRET=<strong_key>
JWT_EXPIRE=7d
CORS_ORIGIN=<frontend_url>
EOF
```

- [ ] .env file created with all variables

### Step 6: Install PM2
```bash
sudo npm install -g pm2
pm2 start src/server.js --name "blog-api"
pm2 startup
pm2 save
```

- [ ] PM2 installed
- [ ] Application started with PM2
- [ ] Startup script configured

### Step 7: Setup Nginx
```bash
sudo apt install nginx -y
```

Create `/etc/nginx/sites-available/blog-api`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/blog-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

- [ ] Nginx configured
- [ ] Reverse proxy working

### Step 8: SSL Certificate (Let's Encrypt)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

- [ ] SSL certificate installed
- [ ] HTTPS enabled

### Step 9: Test
```bash
curl http://your-instance-ip:5000/api/health
curl https://your-domain.com/api/health
```

- [ ] Application accessible via IP
- [ ] Application accessible via domain
- [ ] HTTPS working

- [ ] Deployed URL: `https://your-domain.com`

---

## ✅ Post-Deployment Verification

### API Testing
```bash
# Test all endpoints
curl https://your-deployed-url/api/health
curl -X POST https://your-deployed-url/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"pass123"}'
```

- [ ] Health check returns 200
- [ ] Registration works
- [ ] Can create blog post
- [ ] Can login with credentials
- [ ] JWT tokens are generated

### Security Verification
- [ ] HTTPS is enabled
- [ ] CORS headers are correct
- [ ] Error messages don't expose system details
- [ ] Invalid tokens return 401
- [ ] Authentication is required for protected routes

### Performance Verification
- [ ] API responds quickly (<500ms)
- [ ] Database queries are fast
- [ ] No console errors in logs
- [ ] Memory usage is stable

### Monitoring Setup (Optional)
- [ ] Setup error tracking (Sentry, Rollbar)
- [ ] Setup uptime monitoring (Pingdom, UptimeRobot)
- [ ] Setup log aggregation (Loggly, CloudWatch)
- [ ] Setup performance monitoring (New Relic, DataDog)

---

## 🔄 Continuous Deployment

### Auto-Deploy on Git Push (Render)
```bash
git add .
git commit -m "Feature: Add new endpoint"
git push origin main
# Automatically deploys to Render
```

- [ ] GitHub integration working
- [ ] Auto-deploy on push enabled (Render)

### Manual Redeploy (Heroku)
```bash
git push heroku main
```

- [ ] Redeploy works on demand

### Manual Redeploy (AWS)
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
cd backend2-6
git pull origin main
npm install
pm2 restart blog-api
```

- [ ] Manual redeploy process documented

---

## 📊 Monitoring After Deployment

### Check Application Status
- [ ] Application is running
- [ ] No errors in logs
- [ ] All endpoints responding
- [ ] Database connection stable
- [ ] Memory usage normal

### Performance Metrics
- [ ] Response time < 500ms
- [ ] CPU usage < 70%
- [ ] Memory usage < 500MB
- [ ] Database connections stable

### Error Tracking
- [ ] Monitor error logs daily
- [ ] Setup alerts for 500 errors
- [ ] Setup alerts for authentication failures
- [ ] Track API usage patterns

---

## 🔒 Security After Deployment

### Regular Maintenance
- [ ] Update Node.js regularly
- [ ] Update npm packages: `npm update`
- [ ] Monitor security advisories: `npm audit`
- [ ] Rotate JWT_SECRET every 6 months
- [ ] Review database backups

### Monitoring
- [ ] Monitor for suspicious login attempts
- [ ] Monitor for abuse/rate limiting
- [ ] Monitor unauthorized access attempts (403s)
- [ ] Check authentication token usage patterns

### Backups
- [ ] MongoDB automatic backups enabled
- [ ] Code backed up on GitHub
- [ ] Regular database snapshots
- [ ] Disaster recovery plan in place

---

## 📝 Deployment Summary

| Platform | URL | Time | Cost |
|----------|-----|------|------|
| **Render** | https://blog-api-backend.onrender.com | 5 min | Free |
| **Heroku** | https://blog-api-backend.herokuapp.com | 3 min | Free (paid only) |
| **AWS** | https://your-domain.com | 15 min | Free (1yr) |

---

## ✨ You're Live!

Your Blog API is now deployed and accessible to the world. 

**Next Steps:**
1. Share deployed URL with frontend team
2. Update frontend to use deployed API
3. Monitor application performance
4. Gather user feedback
5. Plan for scaling improvements

---

**Deployment Complete! 🎉**
