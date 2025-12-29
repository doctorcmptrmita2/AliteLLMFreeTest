'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import StatsCard from '@/components/StatsCard'

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests: 0,
    dailyRequests: 0,
    totalTokens: 0,
    totalCost: 0,
    monthlyQuota: 1000000,
    monthlyUsed: 0,
  })

  const [task, setTask] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch real stats from LiteLLM (filtered by test API key)
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }
    
    fetchStats()
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRun = async () => {
    if (!task.trim()) return

    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      })

      const data = await response.json()
      setResult(data.result || data.error || 'Sonuç alınamadı')
      
      // Stats güncelle
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests + 1,
        dailyRequests: prev.dailyRequests + 1,
      }))
    } catch (error) {
      setResult(`Hata: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const quotaPercentage = (stats.monthlyUsed / stats.monthlyQuota) * 100
  const remaining = stats.monthlyQuota - stats.monthlyUsed

  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
            <p className="text-gray-400">API kullanım istatistikleri ve yönetim</p>
            <div className="mt-2 glass rounded-lg px-4 py-2 inline-block">
              <span className="text-sm text-gray-400">Test API Key: </span>
              <span className="text-sm font-mono text-purple-400">sk-o3aQF9PIyMLQYYSTs4h5qg</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Toplam İstek"
              value={stats.totalRequests.toLocaleString()}
              change="+12%"
              icon="📊"
              gradient="bg-gradient-to-r from-indigo-600 to-purple-600"
            />
            <StatsCard
              title="Günlük İstek"
              value={stats.dailyRequests}
              change="+5"
              icon="📅"
              gradient="bg-gradient-to-r from-purple-600 to-pink-600"
            />
            <StatsCard
              title="Toplam Token"
              value={stats.totalTokens.toLocaleString()}
              icon="🔢"
              gradient="bg-gradient-to-r from-pink-600 to-red-500"
            />
            <StatsCard
              title="Toplam Maliyet"
              value={`$${stats.totalCost.toFixed(2)}`}
              icon="💰"
              gradient="bg-gradient-to-r from-red-500 to-orange-500"
            />
          </div>

          {/* Quota Card */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Aylık Kota</h2>
              <span className="text-sm text-gray-400">
                {remaining.toLocaleString()} / {stats.monthlyQuota.toLocaleString()} kaldı
              </span>
            </div>
            <div className="w-full bg-[#0a0a1a] rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Kullanılan: {stats.monthlyUsed.toLocaleString()}</span>
              <span>Kalan: {remaining.toLocaleString()}</span>
            </div>
          </div>

          {/* Quick Run */}
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Hızlı Çalıştır</h2>
            <div className="space-y-4">
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Örn: Create a simple REST API endpoint"
                className="w-full px-4 py-3 bg-[#0a0a1a] border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500"
                rows={4}
              />
              <button
                onClick={handleRun}
                disabled={loading || !task.trim()}
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Çalışıyor...' : '🚀 Çalıştır (Plan → Code → Review)'}
              </button>
            </div>

            {result && (
              <div className="mt-6 p-4 bg-[#0a0a1a] rounded-lg border border-white/10">
                <h3 className="font-bold mb-2 text-white">Sonuç:</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{result}</pre>
              </div>
            )}
          </div>

          {/* Usage Chart Placeholder */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Kullanım Grafiği</h2>
            <div className="h-64 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📈</div>
                <p>Grafik yakında eklenecek</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
