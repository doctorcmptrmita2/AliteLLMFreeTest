// Simple JWT-based authentication system
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'roo-code-secret-key-change-in-production-2025'
)

export interface User {
  id: string
  email: string
  name: string
  passwordHash: string
  createdAt: Date
  apiKeys: string[] // LiteLLM API key IDs associated with this user
}

// Simple in-memory user store (replace with database in production)
const users: Map<string, User> = new Map()
const userPasswords: Map<string, string> = new Map() // email -> password hash

export async function signToken(user: User): Promise<string> {
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET)
  
  return token
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    // Get user from database
    const user = await getUserById(payload.userId as string)
    return user
  } catch (error) {
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  
  if (!token) return null
  
  return await verifyToken(token)
}

export async function getUserByEmail(email: string): Promise<User | null> {
  for (const user of users.values()) {
    if (user.email === email) {
      return user
    }
  }
  return null
}

export async function getUserById(id: string): Promise<User | null> {
  return users.get(id) || null
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  // Check if user exists
  const existing = await getUserByEmail(email)
  if (existing) {
    throw new Error('User already exists')
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)
  
  const userId = Math.random().toString(36).substring(2, 15)
  const user: User = {
    id: userId,
    email,
    name,
    passwordHash,
    createdAt: new Date(),
    apiKeys: [],
  }
  
  users.set(userId, user)
  userPasswords.set(email, passwordHash)
  
  return user
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  
  const storedHash = userPasswords.get(email) || user.passwordHash
  const isValid = await bcrypt.compare(password, storedHash)
  
  return isValid ? user : null
}

export async function addApiKeyToUser(userId: string, apiKeyId: string): Promise<void> {
  const user = await getUserById(userId)
  if (user && !user.apiKeys.includes(apiKeyId)) {
    user.apiKeys.push(apiKeyId)
    users.set(userId, user)
  }
}

export async function getUserApiKeys(userId: string): Promise<string[]> {
  const user = await getUserById(userId)
  return user?.apiKeys || []
}

// Initialize test user on module load (only if enabled)
if (typeof window === 'undefined') {
  // Server-side only
  const shouldSeed = process.env.SEED_TEST_USER === 'true' || process.env.NODE_ENV === 'development'
  if (shouldSeed) {
    // Import and run seed asynchronously to avoid blocking
    import('./seed').then(({ seedTestUser }) => {
      seedTestUser().catch((err) => {
        console.error('[Auth] Seed error:', err)
      })
    }).catch(() => {
      // Ignore import errors
    })
  }
}

