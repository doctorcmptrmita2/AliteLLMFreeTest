import { NextResponse } from 'next/server'
import { seedTestUser } from '@/lib/seed'

export const dynamic = 'force-dynamic'

// Admin endpoint to seed test user
// Only accessible in development or with admin key
export async function POST(request: Request) {
  try {
    // Simple security check - in production, add proper authentication
    const authHeader = request.headers.get('authorization')
    const adminKey = process.env.ADMIN_SEED_KEY || 'admin-seed-key-2025'
    
    if (authHeader !== `Bearer ${adminKey}` && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    const user = await seedTestUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Failed to seed user' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Test user seeded: ${user.email}`,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        apiKeys: user.apiKeys,
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Seed failed' },
      { status: 500 }
    )
  }
}

// GET endpoint to check if user exists
export async function GET() {
  try {
    const { getUserByEmail } = await import('@/lib/auth')
    const user = await getUserByEmail('doctor.cmptr.mita2@gmail.com')
    
    return NextResponse.json({
      exists: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        name: user.name,
        apiKeys: user.apiKeys,
      } : null,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check user' },
      { status: 500 }
    )
  }
}

