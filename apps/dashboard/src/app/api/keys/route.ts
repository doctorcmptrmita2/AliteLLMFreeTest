import { NextResponse } from 'next/server'
import { getKeys, createKey, deleteKey } from '@/lib/litellm'
import { getCurrentUser, getUserApiKeys, addApiKeyToUser } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get all keys from LiteLLM
    const allKeys = await getKeys()
    
    // Filter to only user's keys
    const userApiKeyIds = await getUserApiKeys(user.id)
    const keys = allKeys.filter((key: any) => {
      const keyId = key.key_id || key.token || key.id || ''
      return userApiKeyIds.includes(keyId)
    })
    
    // Format keys for frontend - handle different LiteLLM key formats
    const formattedKeys = keys.map((key: any) => {
      // Parse key ID/token
      const keyId = key.key_id || key.token || key.id || ''
      const keyToken = key.token || key.key_id || key.api_key || ''
      
      // Parse name
      const name = key.metadata?.key_name || key.key_name || key.name || 'Unnamed Key'
      
      // Parse created date
      let created = new Date().toISOString().split('T')[0]
      const createdFields = ['created_at', 'created', 'date_created', 'timestamp']
      for (const field of createdFields) {
        if (key[field]) {
          try {
            created = new Date(key[field]).toISOString().split('T')[0]
            break
          } catch (e) {
            // Continue
          }
        }
      }
      
      // Parse requests/usage
      const requests = key.total_requests || key.requests || key.usage?.total_requests || 0
      
      // Parse spend
      const spend = key.spend || key.total_spend || key.usage?.spend || 0
      
      // Parse status
      let status = 'active'
      if (key.expires_at) {
        try {
          const expiresAt = new Date(key.expires_at)
          status = expiresAt < new Date() ? 'expired' : 'active'
        } catch (e) {
          // Keep default
        }
      }
      if (key.is_active === false || key.active === false) {
        status = 'inactive'
      }
      
      return {
        id: keyId,
        name,
        key: keyToken,
        created,
        requests,
        status,
        spend,
      }
    })
    
    return NextResponse.json(formattedKeys)
  } catch (error) {
    console.error('Error fetching keys:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { name } = await request.json()
    
    // Create key in LiteLLM with user metadata
    // LiteLLM uses user_id in metadata to associate key with user
    const newKey = await createKey(name || `Key for ${user.email}`, {
      user_id: user.id,
      user_email: user.email,
      created_by: 'dashboard',
    })
    
    // Get the actual key token and ID
    const keyToken = newKey.token || newKey.key || newKey.key_id || ''
    const keyId = newKey.key_id || newKey.token || keyToken
    
    if (!keyToken) {
      throw new Error('Failed to create API key: No token returned')
    }
    
    // Associate key with user in our system
    await addApiKeyToUser(user.id, keyId)
    
    return NextResponse.json({
      id: keyId,
      name: name || 'New API Key',
      key: keyToken, // Return the full token so user can copy it
      created: new Date().toISOString().split('T')[0],
      requests: 0,
      status: 'active',
    })
  } catch (error) {
    console.error('Error creating key:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('key_id')
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'key_id is required' },
        { status: 400 }
      )
    }
    
    // Verify the key belongs to the user
    const userApiKeyIds = await getUserApiKeys(user.id)
    if (!userApiKeyIds.includes(keyId)) {
      return NextResponse.json(
        { error: 'API key not found or access denied' },
        { status: 403 }
      )
    }
    
    // Delete from LiteLLM
    await deleteKey(keyId)
    
    // Remove from database
    const { removeApiKeyFromUser } = await import('@/lib/auth')
    await removeApiKeyFromUser(user.id, keyId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting key:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


