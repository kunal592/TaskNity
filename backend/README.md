# TaskNity Backend

NestJS + Prisma + PostgreSQL backend for TaskNity project management platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Setup Environment
```bash
# Copy example env file and update DATABASE_URL
cp .env.example .env
```

Update `.env` with your PostgreSQL connection:
```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/tasknity?schema=public"
JWT_SECRET="your-super-secret-key"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Push schema to database
npm run db:push

# Seed with test data
npm run db:seed
```

### 4. Start Server
```bash
# Development
npm run start:dev

# Production
npm run build && npm run start:prod
```

Server runs at: `http://localhost:3001/api`

## 📋 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Owner | owner@tasknity.com | password123 |
| Admin | admin@tasknity.com | password123 |
| Member | brian@tasknity.com | password123 |
| Viewer | viewer@tasknity.com | password123 |

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (protected)

### Users
- `GET /api/users` - List all users
- `GET /api/users/me` - Get my profile
- `PATCH /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project (Admin)
- `PATCH /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)

### Tasks
- `GET /api/tasks` - List tasks
- `GET /api/tasks/classified` - Classified tasks (Admin only)
- `POST /api/tasks` - Create task
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Admin)

### Attendance
- `GET /api/attendance` - All attendance (Admin)
- `GET /api/attendance/today` - Today's attendance
- `GET /api/attendance/my` - My attendance
- `POST /api/attendance` - Mark attendance

### Leaves
- `GET /api/leaves` - All leave requests (Admin)
- `GET /api/leaves/my` - My leave requests
- `POST /api/leaves` - Apply for leave
- `PATCH /api/leaves/:id` - Approve/Reject (Admin)

### Expenses
- `GET /api/expenses` - All expenses (Admin)
- `GET /api/expenses/my` - My expenses
- `POST /api/expenses` - Submit expense
- `PATCH /api/expenses/:id` - Approve/Reject (Admin)

## 🔐 RBAC Roles

| Permission | Owner | Admin | Member | Viewer |
|------------|-------|-------|--------|--------|
| Manage Users | ✅ | ✅ | ❌ | ❌ |
| Manage Projects | ✅ | ✅ | ❌ | ❌ |
| Classified Tasks | ✅ | ✅ | ❌ | ❌ |
| Create/Edit Tasks | ✅ | ✅ | ✅ | ❌ |
| Mark Attendance | ✅ | ✅ | ✅ | ❌ |
| View Analytics | ✅ | ✅ | ✅ | ✅ |
