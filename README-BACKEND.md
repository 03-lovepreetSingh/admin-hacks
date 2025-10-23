# Admin Hacks - Next.js Backend

A comprehensive hackathon management system built with Next.js, Drizzle ORM, and PostgreSQL.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

3. **Configure your database:**
   Update the `DATABASE_URL` in `.env.local` with your PostgreSQL connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/admin_hacks"
   ```

4. **Generate and run migrations:**
   ```bash
   # Generate migration files
   pnpm db:generate
   
   # Apply migrations to database
   pnpm db:migrate
   
   # Or push schema directly (for development)
   pnpm db:push
   ```

5. **Start the development server:**
   ```bash
   pnpm dev
   ```

## 📊 Database Schema

The system includes the following main entities:

- **Users** - Admin and judge accounts
- **Hackathons** - Event management with status tracking
- **Prizes** - Prize categories for hackathons
- **Judge Assignments** - Mapping judges to hackathons
- **Projects** - Team submissions
- **Project Scores** - Judge scoring system
- **Notifications** - System notifications

## 🔐 Authentication

The system uses JWT-based authentication with HTTP-only cookies for security.

### User Roles
- **Admin**: Full system access
- **Judge**: Can view and score assigned hackathons

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Hackathons Management
- `GET /api/hackathons` - List hackathons (with filtering)
- `POST /api/hackathons` - Create hackathon (admin only)
- `GET /api/hackathons/[id]` - Get hackathon details
- `PUT /api/hackathons/[id]` - Update hackathon (admin only)
- `DELETE /api/hackathons/[id]` - Delete hackathon (admin only)

### Judge Assignment
- `GET /api/hackathons/[id]/judges` - Get assigned judges
- `POST /api/hackathons/[id]/judges` - Assign judge (admin only)
- `DELETE /api/hackathons/[id]/judges` - Remove judge assignment (admin only)

### Judges Management
- `GET /api/judges` - List judges
- `POST /api/judges` - Create judge account (admin only)
- `GET /api/judges/[id]` - Get judge details
- `PUT /api/judges/[id]` - Update judge (admin only)
- `DELETE /api/judges/[id]` - Deactivate judge (admin only)

### Projects Management
- `GET /api/projects` - List projects (with filtering)
- `POST /api/projects` - Submit project
- `GET /api/projects/[id]` - Get project details (judge/admin only)
- `PUT /api/projects/[id]` - Update project (admin only)
- `DELETE /api/projects/[id]` - Delete project (admin only)

### Project Scoring
- `GET /api/projects/[id]/scores` - Get project scores
- `POST /api/projects/[id]/scores` - Submit/update score (judge only)

### Leaderboard
- `GET /api/leaderboard/[hackathonId]` - Get hackathon leaderboard

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification (admin only)
- `GET /api/notifications/[id]` - Get specific notification
- `PUT /api/notifications/[id]` - Update notification
- `DELETE /api/notifications/[id]` - Delete notification (admin only)
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Dashboard
- `GET /api/dashboard/stats` - Get system statistics (admin only)

## 🛠 Database Commands

```bash
# Generate migration files from schema changes
pnpm db:generate

# Apply migrations to database
pnpm db:migrate

# Push schema directly (development only)
pnpm db:push

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## 🔧 Environment Variables

Required environment variables in `.env.local`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/admin_hacks"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# NextAuth (if using)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
APP_URL="http://localhost:3000"

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"

# File Upload
MAX_FILE_SIZE="10485760"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,application/pdf"

# Rate Limiting
RATE_LIMIT_MAX="100"
RATE_LIMIT_WINDOW="900000"
```

## 🏗 Project Structure

```
app/
├── api/                    # API routes
│   ├── auth/              # Authentication endpoints
│   ├── hackathons/        # Hackathon management
│   ├── judges/            # Judge management
│   ├── projects/          # Project management
│   ├── notifications/     # Notification system
│   ├── leaderboard/       # Scoring and rankings
│   └── dashboard/         # Admin statistics
├── admin/                 # Admin dashboard pages
├── judge/                 # Judge dashboard pages
└── ...

lib/
├── db/
│   ├── schema.ts          # Database schema
│   └── index.ts           # Database connection
├── auth-utils.ts          # Authentication utilities
└── ...

drizzle/                   # Migration files
```

## 🔒 Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcryptjs
- Role-based access control
- Input validation with Zod
- SQL injection prevention with Drizzle ORM
- Rate limiting ready configuration

## 📝 API Usage Examples

### Register Admin User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "SecurePassword123!",
    "role": "admin"
  }'
```

### Create Hackathon
```bash
curl -X POST http://localhost:3000/api/hackathons \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=your-jwt-token" \
  -d '{
    "name": "AI Innovation Challenge",
    "description": "Build the next generation AI application",
    "startDate": "2024-03-01T00:00:00Z",
    "endDate": "2024-03-03T23:59:59Z",
    "registrationDeadline": "2024-02-28T23:59:59Z",
    "maxTeamSize": 4,
    "prizes": [
      {
        "position": 1,
        "title": "First Place",
        "amount": 5000,
        "description": "Winner takes all"
      }
    ]
  }'
```

### Submit Project Score
```bash
curl -X POST http://localhost:3000/api/projects/project-id/scores \
  -H "Content-Type: application/json" \
  -H "Cookie: auth-token=your-jwt-token" \
  -d '{
    "innovation": 9,
    "design": 8,
    "functionality": 9,
    "presentation": 8,
    "comments": "Excellent project with innovative approach"
  }'
```

## 🚨 Important Notes

1. **Database Setup**: Make sure your PostgreSQL database is running and accessible
2. **Environment Variables**: All required environment variables must be set
3. **First User**: The first registered user with role "admin" will have full access
4. **Migrations**: Always run migrations after schema changes
5. **Security**: Never commit `.env.local` to version control

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `DATABASE_URL` format
   - Ensure PostgreSQL is running
   - Verify database credentials

2. **Migration Errors**
   - Run `pnpm db:generate` after schema changes
   - Check for syntax errors in schema files
   - Ensure database is accessible

3. **Authentication Issues**
   - Verify `JWT_SECRET` is set
   - Check cookie settings in browser
   - Ensure proper role assignments

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Happy Hacking! 🚀**