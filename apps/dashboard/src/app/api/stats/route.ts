import { NextResponse } from 'next/server'
import { getUsage, getSpend, getKeys } from '@/lib/litellm'
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
    
    // Get user's API keys
    const userApiKeyIds = await getUserApiKeys(user.id)
    if (userApiKeyIds.length === 0) {
      // No API keys yet, return empty stats
      return NextResponse.json({
        totalRequests: 0,
        dailyRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        monthlyQuota: 1000000,
        monthlyUsed: 0,
        keysCount: 0,
      })
    }
    
    // Get API key from query params or use first user key
    const { searchParams } = new URL(request.url)
    const requestedKey = searchParams.get('api_key')
    const apiKey = requestedKey && userApiKeyIds.includes(requestedKey) 
      ? requestedKey 
      : userApiKeyIds[0] // Use first key if not specified or invalid
    
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
    
    // Calculate stats - handle different response formats
    const totalRequests = usage?.total_requests || usage?.requests || 0
    const totalTokens = usage?.total_tokens || usage?.tokens || 0
    const totalCost = spend?.total_spend || spend?.spend || spend?.cost || 0
    const dailyRequests = dailyUsage?.total_requests || dailyUsage?.requests || 0
    
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

