import { NextResponse } from 'next/server'
import { getLogs } from '@/lib/litellm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    const apiKey = searchParams.get('api_key') || process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'
    
    console.log('[/api/logs] Fetching logs with params:', { 
      startDate, 
      endDate, 
      limit, 
      apiKey: apiKey.substring(0, 10) + '...',
      hasMasterKey: !!process.env.LITELLM_MASTER_KEY,
      baseUrl: process.env.LITELLM_BASE_URL
    })
    
    let logs
    try {
      logs = await getLogs(startDate, endDate, limit, apiKey)
      console.log(`[/api/logs] Fetched ${logs.length} logs from LiteLLM`)
      
      // Log first entry for debugging
      if (logs.length > 0) {
        console.log('[/api/logs] Sample log entry:', JSON.stringify(logs[0], null, 2))
      }
    } catch (error) {
      console.error('[/api/logs] Error in getLogs:', error)
      // Return empty array on error
      logs = []
    }
    
    // Format logs for frontend - handle different LiteLLM log formats
    const formattedLogs = logs.map((log: any) => {
      // Parse timestamp
      let timestamp = 'N/A'
      if (log.created_at) {
        timestamp = new Date(log.created_at).toLocaleString('tr-TR')
      } else if (log.startTime) {
        timestamp = new Date(log.startTime).toLocaleString('tr-TR')
      }
      
      // Parse tokens
      const promptTokens = log.prompt_tokens || log.request_data?.prompt_tokens || 0
      const completionTokens = log.completion_tokens || log.request_data?.completion_tokens || 0
      const totalTokens = log.total_tokens || (promptTokens + completionTokens)
      
      // Parse duration
      let duration = 'N/A'
      if (log.duration) {
        duration = `${(log.duration / 1000).toFixed(2)}s`
      } else if (log.response_time) {
        duration = `${(log.response_time / 1000).toFixed(2)}s`
      }
      
      // Parse API key
      const apiKeyValue = log.api_key || log.user_api_key || log.user_api_key_hash || ''
      const apiKeyDisplay = apiKeyValue ? 
        (apiKeyValue.length > 20 ? `${apiKeyValue.substring(0, 20)}...` : apiKeyValue) : 
        'N/A'
      
      // Parse status
      const status = log.status_code || log.response_status || log.status || 200
      
      // Parse key hash and name
      const keyHash = log.user_api_key_hash || log.api_key_hash || ''
      const keyName = log.metadata?.key_name || log.key_name || ''
      
      // Parse user
      const user = log.user_id || log.internal_user_id || 'default_user_id'
      
      // Parse request ID
      const requestId = log.request_id || log.id || log.log_id || ''
      
      return {
        id: log.id || log.request_id || log.log_id || Math.random().toString(36),
        requestId: requestId.length > 20 ? `${requestId.substring(0, 20)}...` : requestId,
        timestamp,
        endpoint: log.request_path || log.path || '/v1/chat/completions',
        method: log.request_method || log.method || 'POST',
        status,
        tokens: totalTokens,
        cost: log.spend || log.cost || 0,
        duration,
        apiKey: apiKeyDisplay,
        keyHash: keyHash.length > 20 ? `${keyHash.substring(0, 20)}...` : keyHash,
        keyName,
        model: log.model || log.model_name || 'N/A',
        promptTokens,
        completionTokens,
        user,
      }
    })
    
    console.log(`Formatted ${formattedLogs.length} logs`)
    return NextResponse.json(formattedLogs)
  } catch (error) {
    console.error('Error in /api/logs:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}

