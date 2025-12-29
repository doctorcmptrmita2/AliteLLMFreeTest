import { NextResponse } from 'next/server'
import { getKeys, createKey, deleteKey } from '@/lib/litellm'

export async function GET() {
  try {
    const keys = await getKeys()
    
    // Format keys for frontend
    const formattedKeys = keys.map((key: any) => ({
      id: key.key_id || key.token,
      name: key.metadata?.key_name || 'Unnamed Key',
      key: key.token || key.key_id || '',
      created: key.created_at ? new Date(key.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      requests: key.spend || 0,
      status: key.expires_at && new Date(key.expires_at) < new Date() ? 'expired' : 'active',
      spend: key.spend || 0,
    }))
    
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

