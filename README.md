# TaskNity - Project Management & Team Collaboration Platform

This is a modern, responsive project management dashboard built with **Next.js 14**, **Tailwind CSS**, and **TypeScript**. 

## 🚀 Getting Started (Frontend)

1.  **Install dependencies:** `npm install`
2.  **Run dev server:** `npm run dev`
3.  **Open:** `http://localhost:3000`

---

## 🛠️ Backend Implementation Plan (NestJS + Prisma)

This guide outlines how to build the production-ready backend for TaskNity using **NestJS**, **Prisma (PostgreSQL)**, and **Passport.js**.

### 1. Technology Stack
*   **Framework**: NestJS (Modular, Scalable Node.js framework)
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Authentication**: Passport.js (JWT Strategy)
*   **Authorization**: RBAC (Role-Based Access Control) using Guards & Custom Decorators.

### 2. Production Folder Structure
Create a `backend` folder in your root directory. Inside `backend/src`, use this modular structure:

```bash
backend/src/
├── common/                  # Shared utilities
│   ├── decorators/          # Custom decorators
│   │   ├── get-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── guards/              # auth & permission guards
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── filters/             # Global exception filters
│   ├── filters/             # Global exception filters (HttpExceptionFilter, etc.)
│   │   └── all-exceptions.filter.ts
│   └── dto/                 # Shared DTOs (pagination, etc)
├── config/                  # Environment config
│   └── env.config.ts
├── modules/                 # Feature modules
│   ├── auth/                # Auth logic (Login/Register)
│   │   ├── strategies/      # JWT Strategy
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/               # key: Users & Teams
│   ├── projects/            # key: Projects
│   ├── tasks/               # key: Tasks (Kanban)
│   ├── attendance/          # key: Attendance
│   ├── leaves/              # key: Leave Requests
│   └── expenses/            # key: Expense Management
├── prisma/                  # Database connection
│   └── prisma.service.ts    # Prisma Client instance
├── app.module.ts            # Root Module
└── main.ts                  # Entry point
```

### 3. Database Schema (`prisma/schema.prisma`)
Copy this schema to your `backend/prisma/schema.prisma` file.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}

enum Priority {
  HIGH
  MEDIUM
  LOW
}

enum AttendanceStatus {
  PRESENT
  ABSENT
  REMOTE
  ON_LEAVE
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String    // Hashed
  name          String
  role          Role      @default(MEMBER)
  team          String?
  phone         String?
  address       String?
  joinedAt      DateTime  @default(now())
  
  // Relations
  projects      Project[] @relation("ProjectMembers")
  tasks         Task[]    @relation("TaskAssignees")
  attendance    Attendance[]
  leaves        Leave[]
  expenses      Expense[]
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Project {
  id          String   @id @default(uuid())
  title       String
  progress    Int      @default(0)
  isPublic    Boolean  @default(true)
  
  members     User[]   @relation("ProjectMembers")
  tasks       Task[]
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Task {
  id          String      @id @default(uuid())
  title       String
  description String?
  status      TaskStatus  @default(TODO)
  priority    Priority    @default(MEDIUM)
  deadline    DateTime?
  classified  Boolean     @default(false)
  isDraft     Boolean     @default(false)
  
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  assignees   User[]      @relation("TaskAssignees")
  
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model Attendance {
  id        String           @id @default(uuid())
  date      DateTime         @db.Date
  status    AttendanceStatus
  
  userId    String
  user      User             @relation(fields: [userId], references: [id])
  
  createdAt DateTime         @default(now())
  
  @@unique([userId, date]) // One entry per user per day
}

model Leave {
  id        String        @id @default(uuid())
  reason    String
  date      DateTime      @db.Date
  status    RequestStatus @default(PENDING)
  
  userId    String
  user      User          @relation(fields: [userId], references: [id])
  
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Expense {
  id          String        @id @default(uuid())
  title       String
  category    String
  amount      Float
  date        DateTime      @db.Date
  status      RequestStatus @default(PENDING)
  
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}
```

### 4. Authentication & RBAC Implementation

#### Authentication (Passport JWT)
1.  **Login**: User posts email/password -> Backend validates -> Returns JWT.
2.  **JWT Payload**: `{ sub: user.id, email: user.email, role: user.role }`.
3.  **Guard**: Use `AuthGuard('jwt')` on protected routes.

#### RBAC (Role-Based Access Control)
1.  Create a **Roles Decorator** (`common/decorators/roles.decorator.ts`):
    ```typescript
    import { SetMetadata } from '@nestjs/common';
    import { Role } from '@prisma/client';
    export const ROLES_KEY = 'roles';
    export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
    ```

2.  Create a **Roles Guard** (`common/guards/roles.guard.ts`):
    *   Reads the `@Roles` metadata.
    *   Compares with `request.user.role` (attached by JWT strategy).
    *   Returns `true` if match, `false` (Forbidden) if strictly denied.

3.  **Usage Example**:
    ```typescript
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post('classified')
    createClassifiedTask() { ... }
    ```

### 5. API Endpoints (Summary)

| Resource | Method | Endpoint | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | POST | `/auth/login` | Public |
| | POST | `/auth/register` | Public |
| **User** | GET | `/users/me` | Auth User |
| | GET | `/users` | Admin/Member |
| **Projects** | POST | `/projects` | Admin |
| | GET | `/projects` | All (Filtered) |
| **Tasks** | GET | `/tasks` | All |
| | GET | `/tasks/classified` | Admin Only |

---
🎉 Database seeding completed!

📋 Test Accounts:
  Owner: owner@tasknity.com / password123
  Admin: admin@tasknity.com / password123
  Member: brian@tasknity.com / password123
  Viewer: viewer@tasknity.com / password123