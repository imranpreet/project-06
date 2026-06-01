# 🚀 Deployment Guide

This guide covers deploying the Blog API on **Render**, **Heroku**, and **AWS**.

---

## 📋 Prerequisites for All Platforms

1. **GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/backend2-6.git
   git push -u origin main
   ```

2. **MongoDB Atlas Database**
   - Create free account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Create cluster (free tier available)
   - Create database user
   - Get connection string

3. **Environment Variables** (save for all platforms)
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db
   JWT_SECRET=your_super_secret_key_minimum_32_characters
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-domain.com
   ```

---

## 🟢 Deployment on Render (Recommended - Free)

### Step 1: Connect Repository
1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Sign up with GitHub
3. Click **New** → **Web Service**
4. Select your GitHub repository
5. Choose the `backend2-6` repository

### Step 2: Configure Service
- **Name:** `blog-api` (or your choice)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Instance Type:** Free (or Starter)

### Step 3: Add Environment Variables
1. Scroll to **Environment** section
2. Add these variables:
   ```
   PORT=5000
   NODE_ENV=production
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_secret>
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://<your-frontend-url>
   ```

### Step 4: Deploy
- Click **Deploy** button
- Wait for build to complete (3-5 minutes)
- Check **Logs** for any errors

### Step 5: Test
```bash
curl https://blog-api-XXXXX.onrender.com/api/health
```

### Redeploy on Changes
```bash
git push origin main  # Automatically redeploys
```

---

## 🔵 Deployment on Heroku

### Step 1: Create Heroku Account
1. Go to [https://www.heroku.com](https://www.heroku.com)
2. Sign up and verify email
3. Install Heroku CLI

### Step 2: Login and Create App
```bash
heroku login
heroku create blog-api-backend
```

### Step 3: Add Environment Variables
```bash
heroku config:set PORT=5000
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db
heroku config:set JWT_SECRET=your_super_secret_key
heroku config:set JWT_EXPIRE=7d
heroku config:set CORS_ORIGIN=https://your-frontend.com
```

### Step 4: Deploy
```bash
git push heroku main
```

### Step 5: Test
```bash
heroku open
# or
curl https://blog-api-backend.herokuapp.com/api/health
```

### View Logs
```bash
heroku logs --tail
```

### Redeploy
```bash
git push heroku main
```

---

## 🟠 Deployment on AWS (EC2)

### Step 1: Create EC2 Instance
1. Go to [AWS Console](https://console.aws.amazon.com)
2. EC2 → Instances → Launch Instance
3. Select Ubuntu 20.04 LTS
4. Instance type: t2.micro (free tier)
5. Configure security groups:
   - Port 22 (SSH)
   - Port 5000 (Application)
   - Port 80 (HTTP)
   - Port 443 (HTTPS)

### Step 2: Connect to Instance
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

### Step 3: Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm git -y
```

### Step 4: Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/backend2-6.git
cd backend2-6
npm install
```

### Step 5: Create .env File
```bash
cat > .env << EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db
JWT_SECRET=your_secret
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-domain.com
EOF
```

### Step 6: Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
pm2 start src/server.js --name "blog-api"
pm2 startup
pm2 save
```

### Step 7: Setup Nginx Reverse Proxy
```bash
sudo apt install nginx -y
sudo systemctl start nginx
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

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/blog-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: SSL Certificate (Optional but Recommended)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Step 9: Test
```bash
curl http://your-instance-ip:5000/api/health
```

---

## 🔧 Comparison Table

| Platform | Cost | Startup Time | Ease | Auto-Redeploy |
|----------|------|--------------|------|---------------|
| **Render** | Free | 3-5 min | Very Easy | Yes |
| **Heroku** | Free tier discontinued | 2-3 min | Easy | Yes |
| **AWS EC2** | Free tier (1 year) | 5-10 min | Medium | Manual |

---

## ✅ Post-Deployment Checklist

- [ ] Database is accessible from server
- [ ] Environment variables are set correctly
- [ ] API health endpoint returns 200
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can create a blog post
- [ ] JWT tokens work correctly
- [ ] Error handling returns proper messages
- [ ] CORS is configured for frontend

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check MONGODB_URI format
mongodb+srv://username:password@cluster.mongodb.net/blog_db

# Verify IP whitelist in MongoDB Atlas allows all IPs
```

### Port Already in Use
```bash
# On Render/Heroku: Automatic
# On AWS:
sudo lsof -i :5000
sudo kill -9 <PID>
```

### 502 Bad Gateway (Render/Heroku)
```bash
# Check application logs
# Restart service
# Check Node version compatibility
```

### Cannot Connect to Server
```bash
# Check firewall rules
# Verify security groups allow port 5000
# Test with: curl http://your-ip:5000/api/health
```

---

## 📊 Deployment Architecture

```
GitHub Push
    ↓
(Render/Heroku) Auto-Deploy / (AWS) Manual Deploy
    ↓
Install Dependencies (npm install)
    ↓
Start Application (npm start)
    ↓
Connect to MongoDB Atlas
    ↓
API Ready at public URL
    ↓
Health Check: /api/health
```

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] MongoDB user has limited permissions
- [ ] CORS_ORIGIN is set to your frontend domain
- [ ] Node environment is set to production
- [ ] HTTPS/SSL is enabled
- [ ] API keys are in environment variables (never hardcoded)
- [ ] Database backups are configured

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Heroku Docs:** https://devcenter.heroku.com
- **AWS EC2 Docs:** https://docs.aws.amazon.com/ec2/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/
