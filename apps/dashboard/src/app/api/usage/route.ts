import { NextResponse } from 'next/server'
import { getUsage, getSpend } from '@/lib/litellm'
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
      return NextResponse.json({
        monthlyQuota: 1000000,
        monthlyUsed: 0,
        remaining: 1000000,
        daysRemaining: 0,
        dailyUsage: [],
        totalCost: 0,
      })
    }
    
    const { searchParams } = new URL(request.url)
    const requestedKey = searchParams.get('api_key')
    const apiKey = requestedKey && userApiKeyIds.includes(requestedKey)
      ? requestedKey
      : userApiKeyIds[0]
    
    // Get current month dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const startDate = startOfMonth.toISOString().split('T')[0]
    const endDate = endOfMonth.toISOString().split('T')[0]
    
    // Get last 7 days for daily usage
    // Use Promise.all for parallel requests
    const dailyUsagePromises = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      dailyUsagePromises.push(
        getUsage(dateStr, dateStr, apiKey).then(dayUsage => ({
          date: dateStr,
          requests: dayUsage?.total_requests || dayUsage?.requests || 0,
          tokens: dayUsage?.total_tokens || dayUsage?.tokens || 0,
        })).catch(() => ({
          date: dateStr,
          requests: 0,
          tokens: 0,
        }))
      )
    }
    
    const dailyUsage = await Promise.all(dailyUsagePromises)
    
    // Get monthly totals
    const monthlyUsage = await getUsage(startDate, endDate, apiKey)
    const monthlySpend = await getSpend(startDate, endDate, apiKey)
    
    const monthlyQuota = 1000000
    const monthlyUsed = monthlyUsage?.total_tokens || monthlyUsage?.tokens || 0
    const remaining = monthlyQuota - monthlyUsed
    
    // Calculate days remaining in month
    const daysRemaining = endOfMonth.getDate() - now.getDate()
    
    return NextResponse.json({
      monthlyQuota,
      monthlyUsed,
      remaining,
      daysRemaining: Math.max(0, daysRemaining),
      dailyUsage,
      totalCost: monthlySpend?.total_spend || 0,
    })
  } catch (error) {
    console.error('Error fetching usage:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


