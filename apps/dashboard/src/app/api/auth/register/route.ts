import { NextResponse } from 'next/server'
import { createUser, signToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const { email, name, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Create user
    const user = await createUser(email, name || email.split('@')[0], password)
    
    // Auto-associate API key for specific test email
    const TEST_EMAIL = 'doctor.cmptr.mita2@gmail.com'
    const TEST_API_KEY = 'sk-nWqZQbczxgZPWPrQjdpWTA'
    
    if (email === TEST_EMAIL) {
      const { addApiKeyToUser } = await import('@/lib/auth')
      await addApiKeyToUser(user.id, TEST_API_KEY)
      console.log(`[Register] Auto-associated API key for ${TEST_EMAIL}`)
    }
    
    // Generate token
    const token = await signToken(user)
    
    // Set cookie
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
    
    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Registration failed' },
      { status: 500 }
    )
  }
}

