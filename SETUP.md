# Local Development Setup

Follow these steps to set up and run the project locally.

## 1. Install Dependencies
```bash
npm install
```

## 2. Create .env File
Create a `.env` file in the root directory:

### Option A: Local MongoDB
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/blog_db
JWT_SECRET=your_local_test_secret_key_123456
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Option B: MongoDB Atlas (Cloud)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog_db?retryWrites=true&w=majority
JWT_SECRET=your_local_test_secret_key_123456
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

## 3. Start MongoDB (if using local)

### On Linux/Mac with MongoDB installed:
```bash
mongod
```

### Using Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

## 4. Run Development Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

You should see:
```
╔════════════════════════════════════════╗
║   Blog API Server Running              ║
║   Port: 5000                           ║
║   Environment: development             ║
╚════════════════════════════════════════╝
```

## 5. Test Health Endpoint
```bash
curl http://localhost:5000/api/health
```

## 6. Use Postman Collection
1. Open Postman
2. Import `postman-collection.json`
3. Update `{{token}}` variable after login
4. Test all endpoints

## Project Structure
```
src/
├── config/database.js        - MongoDB connection
├── controllers/              - Business logic
├── middleware/               - Middleware functions
├── models/                   - Mongoose schemas
├── routes/                   - API routes
├── utils/                    - Utility functions
└── server.js                 - Main entry point
```

## API Testing Workflow

### 1. Register User
- Endpoint: `POST /api/auth/register`
- Body: `{"name":"John","email":"john@test.com","password":"password123"}`
- Save the token received

### 2. Create Blog Post
- Endpoint: `POST /api/blogs`
- Header: `Authorization: Bearer <token>`
- Body: `{"title":"My Blog","content":"Content here","category":"Technology"}`

### 3. Get All Blogs
- Endpoint: `GET /api/blogs`
- No authentication required

### 4. Update Blog
- Endpoint: `PUT /api/blogs/<blog_id>`
- Header: `Authorization: Bearer <token>`
- Body: `{"title":"Updated Title"}`

### 5. Delete Blog
- Endpoint: `DELETE /api/blogs/<blog_id>`
- Header: `Authorization: Bearer <token>`

## Common Commands

```bash
# Install dependencies
npm install

# Run development server with auto-reload
npm run dev

# Run production server
npm start

# Check if MongoDB is running
mongosh

# View recent server logs
tail -f logs/app.log
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For local: use `mongodb://localhost:27017/blog_db`
- For Atlas: include credentials and cluster name

### Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Module Not Found Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- Add frontend URL to `CORS_ORIGIN` in .env
- Example: `CORS_ORIGIN=http://localhost:3000`

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment type | development/production |
| MONGODB_URI | Database connection string | mongodb://localhost:27017/blog_db |
| JWT_SECRET | JWT signing secret | your_secret_key |
| JWT_EXPIRE | Token expiration time | 7d |
| CORS_ORIGIN | Allowed frontend URL | http://localhost:3000 |

## API Documentation

Full API documentation is in `README.md`

See `DEPLOYMENT.md` for production deployment instructions.
