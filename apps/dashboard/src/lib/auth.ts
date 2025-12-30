// Production-ready JWT-based authentication system with PostgreSQL
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from './db-client'

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
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email },
      include: { apiKeys: true },
    })
    
    if (!dbUser) return null
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      passwordHash: dbUser.passwordHash,
      createdAt: dbUser.createdAt,
      apiKeys: dbUser.apiKeys.map((key) => key.keyId),
    }
  } catch (error) {
    console.error('Error getting user by email:', error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id },
      include: { apiKeys: true },
    })
    
    if (!dbUser) return null
    
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      passwordHash: dbUser.passwordHash,
      createdAt: dbUser.createdAt,
      apiKeys: dbUser.apiKeys.map((key) => key.keyId),
    }
  } catch (error) {
    console.error('Error getting user by id:', error)
    return null
  }
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  // Check if user exists
  const existing = await getUserByEmail(email)
  if (existing) {
    throw new Error('User already exists')
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10)
  
  // Create user in database
  const dbUser = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
    include: { apiKeys: true },
  })
  
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    passwordHash: dbUser.passwordHash,
    createdAt: dbUser.createdAt,
    apiKeys: dbUser.apiKeys.map((key) => key.keyId),
  }
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email)
  if (!user) return null
  
  const isValid = await bcrypt.compare(password, user.passwordHash)
  
  return isValid ? user : null
}

export async function addApiKeyToUser(userId: string, apiKeyId: string, keyName?: string): Promise<void> {
  try {
    // Check if key already exists for this user
    const existing = await prisma.userApiKey.findUnique({
      where: {
        userId_keyId: {
          userId,
          keyId: apiKeyId,
        },
      },
    })
    
    if (!existing) {
      await prisma.userApiKey.create({
        data: {
          userId,
          keyId: apiKeyId,
          keyName: keyName || 'API Key',
        },
      })
    }
  } catch (error) {
    console.error('Error adding API key to user:', error)
    throw error
  }
}

export async function getUserApiKeys(userId: string): Promise<string[]> {
  try {
    const apiKeys = await prisma.userApiKey.findMany({
      where: { userId },
      select: { keyId: true },
    })
    
    return apiKeys.map((key) => key.keyId)
  } catch (error) {
    console.error('Error getting user API keys:', error)
    return []
  }
}

export async function removeApiKeyFromUser(userId: string, apiKeyId: string): Promise<void> {
  try {
    await prisma.userApiKey.deleteMany({
      where: {
        userId,
        keyId: apiKeyId,
      },
    })
  } catch (error) {
    console.error('Error removing API key from user:', error)
    throw error
  }
}
