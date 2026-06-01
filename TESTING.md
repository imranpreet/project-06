# 🧪 API Testing Guide

Quick reference for testing the Blog API using cURL or Postman.

---

## 🔄 Complete API Flow

```
1. REGISTER → Get Token
   ↓
2. LOGIN → Get Token
   ↓
3. CREATE BLOG (Protected) → Use Token
   ↓
4. GET ALL BLOGS (Public)
   ↓
5. UPDATE BLOG (Protected) → Use Token
   ↓
6. DELETE BLOG (Protected) → Use Token
```

---

## 📝 Step-by-Step Testing

### Step 1: Register User
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Save the token:** `TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

### Step 2: Create Blog Post
**Request:**
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Getting Started with Node.js",
    "content": "Node.js is a JavaScript runtime built on Chromes V8 JavaScript engine...",
    "category": "Technology",
    "tags": ["nodejs", "javascript", "backend"]
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "_id": "507f191e810c19729de860ea",
    "title": "Getting Started with Node.js",
    "content": "Node.js is a JavaScript runtime...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "category": "Technology",
    "tags": ["nodejs", "javascript", "backend"],
    "views": 0,
    "published": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Save the blog ID:** `BLOG_ID=507f191e810c19729de860ea`

---

### Step 3: Get All Blogs
**Request:**
```bash
curl -X GET http://localhost:5000/api/blogs
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "blogs": [
    {
      "_id": "507f191e810c19729de860ea",
      "title": "Getting Started with Node.js",
      "content": "Node.js is a JavaScript runtime...",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "category": "Technology",
      "tags": ["nodejs", "javascript", "backend"],
      "views": 0,
      "published": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

### Step 4: Get Blog by ID (Increments Views)
**Request:**
```bash
curl -X GET http://localhost:5000/api/blogs/$BLOG_ID
```

**Response (200 OK):**
```json
{
  "success": true,
  "blog": {
    "_id": "507f191e810c19729de860ea",
    "title": "Getting Started with Node.js",
    "content": "Node.js is a JavaScript runtime...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "category": "Technology",
    "tags": ["nodejs", "javascript", "backend"],
    "views": 1,
    "published": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### Step 5: Update Blog
**Request:**
```bash
curl -X PUT http://localhost:5000/api/blogs/$BLOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Advanced Node.js Guide",
    "content": "Updated content about Node.js...",
    "published": true
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "blog": {
    "_id": "507f191e810c19729de860ea",
    "title": "Advanced Node.js Guide",
    "content": "Updated content about Node.js...",
    "author": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "category": "Technology",
    "tags": ["nodejs", "javascript", "backend"],
    "views": 1,
    "published": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

---

### Step 6: Delete Blog
**Request:**
```bash
curl -X DELETE http://localhost:5000/api/blogs/$BLOG_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

### Step 7: Get User's Blogs
**Request:**
```bash
curl -X GET http://localhost:5000/api/blogs/user/my-blogs \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "blogs": [
    {
      "_id": "507f191e810c19729de860eb",
      "title": "My Second Blog",
      "content": "...",
      "author": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "category": "Lifestyle",
      "tags": ["personal"],
      "views": 5,
      "published": true,
      "createdAt": "2024-01-15T11:00:00.000Z",
      "updatedAt": "2024-01-15T11:00:00.000Z"
    }
  ]
}
```

---

## ❌ Error Examples

### Invalid Authentication
**Request:**
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer invalid_token"
```

**Response (401 Unauthorized):**
```json
{
  "error": "Invalid token"
}
```

---

### Missing Required Fields
**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

**Response (400 Bad Request):**
```json
{
  "error": "Validation Error",
  "details": [
    "Please provide an email",
    "Please provide a password"
  ]
}
```

---

### Unauthorized Action (Not Author)
**Request (using different user's token):**
```bash
curl -X DELETE http://localhost:5000/api/blogs/$ANOTHER_USER_BLOG_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Response (403 Forbidden):**
```json
{
  "error": "Not authorized to delete this blog"
}
```

---

### Resource Not Found
**Request:**
```bash
curl -X GET http://localhost:5000/api/blogs/invalid_id_123
```

**Response (404 Not Found):**
```json
{
  "error": "Blog not found"
}
```

---

## 🔑 Query Parameters

### Get Blogs by Category
```bash
curl http://localhost:5000/api/blogs?category=Technology
```

### Get Blogs by Published Status
```bash
curl http://localhost:5000/api/blogs?published=true
```

### Combine Filters
```bash
curl http://localhost:5000/api/blogs?category=Technology&published=true
```

---

## 🔒 JWT Token Format

The JWT token contains 3 parts separated by dots:
```
header.payload.signature
```

**Decoded payload example:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "iat": 1705315800,
  "exp": 1705920600
}
```

- `id`: User's MongoDB ObjectId
- `iat`: Issued at (timestamp)
- `exp`: Expiration time (7 days from iat)

---

## 📱 Testing Workflow

### Using Environment Variables in Bash
```bash
# Register and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"

# Create blog
BLOG_ID=$(curl -s -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Blog","content":"Test content","category":"Technology"}' \
  | grep -o '"_id":"[^"]*' | cut -d'"' -f4)

echo "Blog ID: $BLOG_ID"

# Get the blog
curl -s http://localhost:5000/api/blogs/$BLOG_ID | json_pp
```

---

## ✅ Postman Collection Usage

1. **Import Collection:**
   - Open Postman
   - Click Import → Select `postman-collection.json`
   - Set `{{token}}` variable after each login

2. **Use Variables:**
   - `{{token}}`: JWT token (set after login/register)
   - `{{base_url}}`: http://localhost:5000

3. **Test Sequence:**
   - Register User → Copy token to {{token}}
   - Create Blog
   - Get All Blogs
   - Update Blog
   - Delete Blog

---

## 📊 HTTP Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successfully retrieved data |
| 201 | Created | Blog or user created |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Not authorized for action |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected error |

---

## 🛠️ Troubleshooting Common Issues

### Token Expired
**Error:** `"error": "Token has expired"`
**Solution:** Login again to get a new token

### Invalid Email Format
**Error:** Validation error in registration
**Solution:** Use a valid email: `user@domain.com`

### Database Connection Error
**Error:** `"error": "Internal Server Error"`
**Solution:** Check MongoDB is running and MONGODB_URI is correct

### Cannot Modify Another User's Blog
**Error:** `"error": "Not authorized to update this blog"`
**Solution:** Only authors can edit/delete their own blogs

---

For more details, see `README.md` and `DEPLOYMENT.md`
