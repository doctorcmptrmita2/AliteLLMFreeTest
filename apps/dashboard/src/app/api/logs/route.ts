import { NextResponse } from 'next/server'
import { getLogs } from '@/lib/litellm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const apiKey = searchParams.get('api_key') || process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'
    
    const logs = await getLogs(startDate, endDate, limit, apiKey)
    
    // Format logs for frontend
    const formattedLogs = logs.map((log: any) => ({
      id: log.id || log.request_id,
      timestamp: log.created_at ? new Date(log.created_at).toLocaleString('tr-TR') : new Date().toLocaleString('tr-TR'),
      endpoint: log.request_path || '/v1/chat/completions',
      method: log.request_method || 'POST',
      status: log.status_code || 200,
      tokens: log.total_tokens || (log.prompt_tokens || 0) + (log.completion_tokens || 0),
      cost: log.spend || 0,
      duration: log.duration ? `${(log.duration / 1000).toFixed(1)}s` : 'N/A',
      apiKey: log.api_key ? `${log.api_key.substring(0, 10)}...` : 'N/A',
      model: log.model || 'N/A',
    }))
    
    return NextResponse.json(formattedLogs)
  } catch (error) {
    console.error('Error fetching logs:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

