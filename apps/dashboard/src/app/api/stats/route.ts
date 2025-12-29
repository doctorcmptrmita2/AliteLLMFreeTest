import { NextResponse } from 'next/server'
import { getUsage, getSpend, getKeys } from '@/lib/litellm'

export async function GET(request: Request) {
  try {
    // Get API key from query params or use test key
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('api_key') || process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'
    
    // Get current month dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const startDate = startOfMonth.toISOString().split('T')[0]
    const endDate = endOfMonth.toISOString().split('T')[0]
    
    // Get today's date for daily stats
    const today = now.toISOString().split('T')[0]
    
    // Fetch data from LiteLLM filtered by API key
    const [usage, spend, dailyUsage, keys] = await Promise.all([
      getUsage(startDate, endDate, apiKey),
      getSpend(startDate, endDate, apiKey),
      getUsage(today, today, apiKey),
      getKeys(),
    ])
    
    // Calculate stats
    const totalRequests = usage?.total_requests || 0
    const totalTokens = usage?.total_tokens || 0
    const totalCost = spend?.total_spend || 0
    const dailyRequests = dailyUsage?.total_requests || 0
    
    // Calculate monthly quota (default 1M tokens)
    const monthlyQuota = 1000000
    const monthlyUsed = totalTokens
    
    return NextResponse.json({
      totalRequests,
      dailyRequests,
      totalTokens,
      totalCost,
      monthlyQuota,
      monthlyUsed,
      keysCount: keys.length,
      apiKey: apiKey.substring(0, 10) + '...', // Masked key for display
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

