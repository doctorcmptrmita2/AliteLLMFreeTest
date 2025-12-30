import { NextResponse } from 'next/server'
import { getKeys, createKey, deleteKey } from '@/lib/litellm'

export async function GET() {
  try {
    const keys = await getKeys()
    
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
    const { name } = await request.json()
    
    const newKey = await createKey(name || 'New API Key')
    
    return NextResponse.json({
      id: newKey.key_id || newKey.token,
      name: name || 'New API Key',
      key: newKey.token || newKey.key_id || '',
      created: new Date().toISOString().split('T')[0],
      requests: 0,
      status: 'active',
    })
  } catch (error) {
    console.error('Error creating key:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('key_id')
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'key_id is required' },
        { status: 400 }
      )
    }
    
    await deleteKey(keyId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting key:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


