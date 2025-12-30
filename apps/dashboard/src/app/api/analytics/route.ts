import { NextResponse } from 'next/server'
import { getLogs, getUsage } from '@/lib/litellm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('api_key') || process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'
    
    // Get last 30 days
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - 30)
    const startDateStr = startDate.toISOString().split('T')[0]
    const endDateStr = now.toISOString().split('T')[0]
    
    // Get logs for analytics
    const logs = await getLogs(startDateStr, endDateStr, 1000, apiKey)
    
    // Calculate analytics
    const successfulLogs = logs.filter((log: any) => {
      const status = log.status_code || log.response_status || log.status || 200
      return status >= 200 && status < 300
    })
    
    const totalRequests = logs.length
    const successfulRequests = successfulLogs.length
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0
    
    // Calculate average response time
    let totalDuration = 0
    let durationCount = 0
    logs.forEach((log: any) => {
      const duration = log.duration || log.response_time
      if (duration) {
        totalDuration += duration
        durationCount++
      }
    })
    const avgResponseTime = durationCount > 0 ? (totalDuration / durationCount / 1000).toFixed(1) : '0'
    
    // Calculate average tokens per request
    let totalTokens = 0
    let tokenCount = 0
    logs.forEach((log: any) => {
      const tokens = log.total_tokens || (log.prompt_tokens || 0) + (log.completion_tokens || 0)
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
        const logDate = log.created_at || log.startTime
        if (!logDate) return false
        return new Date(logDate).toISOString().split('T')[0] === dateStr
      })
      
      dailyTrend.push({
        date: dateStr,
        requests: dayLogs.length,
      })
    }
    
    // Get endpoint distribution
    const endpointCounts: Record<string, number> = {}
    logs.forEach((log: any) => {
      const endpoint = log.request_path || log.path || '/v1/chat/completions'
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


