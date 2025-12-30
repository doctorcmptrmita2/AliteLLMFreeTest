import { NextResponse } from 'next/server'
import { getLogs, getUsage } from '@/lib/litellm'
import { getCurrentUser, getUserApiKeys } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Get user's API keys
    const userApiKeyIds = await getUserApiKeys(user.id)
    if (userApiKeyIds.length === 0) {
      return NextResponse.json({
        avgResponseTime: '0s',
        successRate: '0%',
        avgTokensPerRequest: 0,
        dailyTrend: [],
        endpointDistribution: [],
      })
    }
    
    const { searchParams } = new URL(request.url)
    const requestedKey = searchParams.get('api_key')
    const apiKey = requestedKey && userApiKeyIds.includes(requestedKey)
      ? requestedKey
      : userApiKeyIds[0]
    
    // Get last 30 days
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - 30)
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = now.toISOString().split('T')[0]
    
    // Get logs for analytics
    const logs = await getLogs(startDateStr, endDateStr, 1000, apiKey)
    
    // Calculate analytics - handle different log formats
    const successfulLogs = logs.filter((log: any) => {
      const statusFields = ['status_code', 'response_status', 'status', 'http_status', 'code']
      let status = 200
      for (const field of statusFields) {
        if (log[field] !== undefined && log[field] !== null) {
          status = parseInt(String(log[field])) || 200
          break
        }
      }
      return status >= 200 && status < 300
    })
    
    const totalRequests = logs.length
    const successfulRequests = successfulLogs.length
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
    
    // Calculate average response time - try multiple duration fields
    let totalDuration = 0
    let durationCount = 0
    logs.forEach((log: any) => {
      const durationFields = ['duration', 'response_time', 'latency', 'time_taken']
      for (const field of durationFields) {
        if (log[field] !== undefined && log[field] !== null) {
          const dur = typeof log[field] === 'number' ? log[field] : parseFloat(log[field])
          if (!isNaN(dur)) {
            totalDuration += dur < 1000 ? dur : dur / 1000 // Convert to seconds if in milliseconds
            durationCount++
            break
          }
        }
      }
    })
    const avgResponseTime = durationCount > 0 ? (totalDuration / durationCount).toFixed(1) : '0'
    
    // Calculate average tokens per request - try multiple token fields
    let totalTokens = 0
    let tokenCount = 0
    logs.forEach((log: any) => {
      const tokens = log.total_tokens || log.totalTokens || 
                     (log.prompt_tokens || log.promptTokens || 0) + 
                     (log.completion_tokens || log.completionTokens || 0)
      if (tokens > 0) {
        totalTokens += tokens
        tokenCount++
      }
    })
    const avgTokensPerRequest = tokenCount > 0 ? Math.round(totalTokens / tokenCount) : 0
    
    // Get daily request trend (last 7 days)
    const dailyTrend = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayLogs = logs.filter((log: any) => {
        const dateFields = ['created_at', 'startTime', 'timestamp', 'time', 'date']
        for (const field of dateFields) {
          if (log[field]) {
            try {
              return new Date(log[field]).toISOString().split('T')[0] === dateStr
            } catch (e) {
              // Continue to next field
            }
          }
        }
        return false
      })
      
      dailyTrend.push({
        date: dateStr,
        requests: dayLogs.length,
      })
    }
    
    // Get endpoint distribution - try multiple path fields
    const endpointCounts: Record<string, number> = {}
    logs.forEach((log: any) => {
      const endpointFields = ['request_path', 'path', 'endpoint', 'url', 'route']
      let endpoint = '/v1/chat/completions'
      for (const field of endpointFields) {
        if (log[field]) {
          endpoint = String(log[field])
          break
        }
      }
      endpointCounts[endpoint] = (endpointCounts[endpoint] || 0) + 1
    })
    
    const endpointDistribution = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    return NextResponse.json({
      avgResponseTime: `${avgResponseTime}s`,
      successRate: `${successRate.toFixed(1)}%`,
      avgTokensPerRequest,
      dailyTrend,
      endpointDistribution,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


