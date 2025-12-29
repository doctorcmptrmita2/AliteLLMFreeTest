'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import StatsCard from '@/components/StatsCard'

export default function Analytics() {
  const [analytics, setAnalytics] = useState({
    avgResponseTime: '0s',
    successRate: '0%',
    avgTokensPerRequest: 0,
    dailyTrend: [] as Array<{ date: string; requests: number }>,
    endpointDistribution: [] as Array<{ endpoint: string; count: number }>,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/analytics')
        if (response.ok) {
          const data = await response.json()
          setAnalytics(data)
        }
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAnalytics()
    const interval = setInterval(fetchAnalytics, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Analitik</h1>
            <p className="text-gray-400">Detaylı kullanım analizi</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                  title="Ortalama Yanıt Süresi"
                  value={analytics.avgResponseTime}
                  icon="⚡"
                  gradient="bg-gradient-to-r from-indigo-600 to-purple-600"
                />
                <StatsCard
                  title="Başarı Oranı"
                  value={analytics.successRate}
                  icon="✅"
                  gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                />
                <StatsCard
                  title="Ortalama Token/İstek"
                  value={analytics.avgTokensPerRequest.toLocaleString()}
                  icon="🔢"
                  gradient="bg-gradient-to-r from-purple-600 to-pink-600"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Günlük İstek Trendi (Son 7 Gün)</h2>
                  {analytics.dailyTrend.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📈</div>
                        <p>Henüz veri yok</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analytics.dailyTrend.map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#0a0a1a] rounded-lg">
                          <span className="text-sm text-gray-300">{day.date}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">{day.requests} istek</span>
                            <div className="w-32 bg-[#121225] rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                                style={{ width: `${Math.min((day.requests / 100) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="glass rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Endpoint Dağılımı</h2>
                  {analytics.endpointDistribution.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <p>Henüz veri yok</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analytics.endpointDistribution.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-[#0a0a1a] rounded-lg">
                          <span className="text-sm text-gray-300 font-mono">{item.endpoint}</span>
                          <span className="text-sm font-bold text-purple-400">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

