import { NextResponse } from 'next/server'
import { getUsage, getSpend } from '@/lib/litellm'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const apiKey = searchParams.get('api_key') || process.env.TEST_API_KEY || 'sk-o3aQF9PIyMLQYYSTs4h5qg'
    
    // Get current month dates
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    const startDate = startOfMonth.toISOString().split('T')[0]
    const endDate = endOfMonth.toISOString().split('T')[0]
    
    // Get last 7 days for daily usage
    const dailyUsage = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const dayUsage = await getUsage(dateStr, dateStr, apiKey)
      dailyUsage.push({
        date: dateStr,
        requests: dayUsage?.total_requests || 0,
        tokens: dayUsage?.total_tokens || 0,
      })
    }
    
    // Get monthly totals
    const monthlyUsage = await getUsage(startDate, endDate, apiKey)
    const monthlySpend = await getSpend(startDate, endDate, apiKey)
    
    const monthlyQuota = 1000000
    const monthlyUsed = monthlyUsage?.total_tokens || 0
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


