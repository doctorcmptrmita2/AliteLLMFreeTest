# Dashboard - Production Setup

## Database Setup

### 1. Run Migrations

```bash
cd apps/dashboard
pnpm db:migrate
```

### 2. Seed Database (Optional)

```bash
pnpm db:seed
```

This will create the test user:
- Email: `doctor.cmptr.mita2@gmail.com`
- Password: `test123456` (change in production!)
- API Key: `sk-nWqZQbczxgZPWPrQjdpWTA`

### 3. Prisma Studio (Development)

```bash
pnpm db:studio
```

## Environment Variables

Copy `.env.example` to `.env` and update:

```bash
DATABASE_URL=postgresql://litellm:litellm_pass@postgres:5432/litellm
AUTH_SECRET=your-secret-key-here
LITELLM_BASE_URL=http://litellm:4000/v1
LITELLM_MASTER_KEY=your-master-key
```

## Production Notes

- ✅ Users are stored in PostgreSQL (persistent)
- ✅ API keys are linked to users in database
- ✅ Password hashing with bcrypt
- ✅ JWT authentication with secure cookies
- ✅ Database migrations with Prisma
- ✅ Type-safe database queries

## Migration Commands

```bash
# Create a new migration
pnpm db:migrate

# Generate Prisma Client
pnpm db:generate

# Reset database (WARNING: deletes all data)
prisma migrate reset
```


