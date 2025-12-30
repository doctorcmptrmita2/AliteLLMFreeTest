import { NextResponse } from 'next/server'
import { getLogs } from '@/lib/litellm'
import { getCurrentUser, getUserApiKeys } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('start_date') || undefined
    const endDate = searchParams.get('end_date') || undefined
    const limit = parseInt(searchParams.get('limit') || '100')
    
    // Get user's API keys
    const userApiKeyIds = await getUserApiKeys(user.id)
    if (userApiKeyIds.length === 0) {
      return NextResponse.json([])
    }
    
    // Get API key from query params or use first user key
    const requestedKey = searchParams.get('api_key')
    const apiKey = requestedKey && userApiKeyIds.includes(requestedKey)
      ? requestedKey
      : userApiKeyIds[0]
    
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
      // Parse timestamp - try multiple fields
      let timestamp = 'N/A'
      const timestampFields = ['created_at', 'startTime', 'timestamp', 'time', 'date']
      for (const field of timestampFields) {
        if (log[field]) {
          try {
            timestamp = new Date(log[field]).toLocaleString('tr-TR')
            break
          } catch (e) {
            // Continue to next field
          }
        }
      }
      
      // Parse tokens - try multiple field names
      const promptTokens = log.prompt_tokens || log.request_data?.prompt_tokens || log.promptTokens || 0
      const completionTokens = log.completion_tokens || log.request_data?.completion_tokens || log.completionTokens || 0
      const totalTokens = log.total_tokens || log.totalTokens || (promptTokens + completionTokens) || 0
      
      // Parse duration - try multiple field names
      let duration = 'N/A'
      const durationFields = ['duration', 'response_time', 'latency', 'time_taken']
      for (const field of durationFields) {
        if (log[field] !== undefined && log[field] !== null) {
          const dur = typeof log[field] === 'number' ? log[field] : parseFloat(log[field])
          if (!isNaN(dur)) {
            duration = dur < 1000 ? `${dur.toFixed(2)}s` : `${(dur / 1000).toFixed(2)}s`
            break
          }
        }
      }
      
      // Parse API key - try multiple field names
      const apiKeyFields = ['api_key', 'user_api_key', 'user_api_key_hash', 'api_key_hash', 'token']
      let apiKeyValue = ''
      for (const field of apiKeyFields) {
        if (log[field]) {
          apiKeyValue = String(log[field])
          break
        }
      }
      const apiKeyDisplay = apiKeyValue ? 
        (apiKeyValue.length > 20 ? `${apiKeyValue.substring(0, 20)}...` : apiKeyValue) : 
        'N/A'
      
      // Parse status - try multiple field names
      const statusFields = ['status_code', 'response_status', 'status', 'http_status', 'code']
      let status = 200
      for (const field of statusFields) {
        if (log[field] !== undefined && log[field] !== null) {
          status = parseInt(String(log[field])) || 200
          break
        }
      }
      
      // Parse key hash and name
      const keyHash = log.user_api_key_hash || log.api_key_hash || log.key_hash || ''
      const keyName = log.metadata?.key_name || log.key_name || log.metadata?.name || ''
      
      // Parse user
      const userFields = ['user_id', 'internal_user_id', 'user', 'end_user_id']
      let user = 'default_user_id'
      for (const field of userFields) {
        if (log[field]) {
          user = String(log[field])
          break
        }
      }
      
      // Parse request ID
      const requestIdFields = ['request_id', 'id', 'log_id', 'trace_id', 'requestId']
      let requestId = ''
      for (const field of requestIdFields) {
        if (log[field]) {
          requestId = String(log[field])
          break
        }
      }
      
      // Parse model
      const model = log.model || log.model_name || log.model_id || 'N/A'
      
      // Parse cost/spend
      const cost = log.spend || log.cost || log.total_cost || 0
      
      // Parse endpoint/path
      const endpoint = log.request_path || log.path || log.endpoint || '/v1/chat/completions'
      
      return {
        id: log.id || log.request_id || log.log_id || Math.random().toString(36),
        requestId: requestId.length > 20 ? `${requestId.substring(0, 20)}...` : requestId,
        timestamp,
        endpoint,
        method: log.request_method || log.method || 'POST',
        status,
        tokens: totalTokens,
        cost,
        duration,
        apiKey: apiKeyDisplay,
        keyHash: keyHash.length > 20 ? `${keyHash.substring(0, 20)}...` : keyHash,
        keyName,
        model,
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

