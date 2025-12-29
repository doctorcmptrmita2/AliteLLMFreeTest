'use client'

import Sidebar from '@/components/Sidebar'

export default function Usage() {
  const usage = {
    monthlyQuota: 1000000,
    monthlyUsed: 456789,
    dailyUsage: [
      { date: '2025-01-25', requests: 120, tokens: 45000 },
      { date: '2025-01-26', requests: 145, tokens: 52000 },
      { date: '2025-01-27', requests: 98, tokens: 38000 },
      { date: '2025-01-28', requests: 167, tokens: 62000 },
      { date: '2025-01-29', requests: 134, tokens: 48000 },
    ],
  }

  const quotaPercentage = (usage.monthlyUsed / usage.monthlyQuota) * 100
  const remaining = usage.monthlyQuota - usage.monthlyUsed
  const daysRemaining = 2 // Bu ay kalan gün

  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Kullanım</h1>
            <p className="text-gray-400">Aylık kota ve kullanım detayları</p>
          </div>

          {/* Quota Overview */}
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Aylık Kota</h2>
              <div className="text-right">
                <div className="text-3xl font-bold gradient-text">
                  {remaining.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">kaldı</div>
              </div>
            </div>
            
            <div className="w-full bg-[#0a0a1a] rounded-full h-6 mb-4">
              <div
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
              >
                <span className="text-xs font-semibold text-white">
                  {quotaPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{usage.monthlyUsed.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Kullanılan</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{usage.monthlyQuota.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Toplam Kota</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{daysRemaining}</div>
                <div className="text-sm text-gray-400">Kalan Gün</div>
              </div>
            </div>
          </div>

          {/* Daily Usage */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Günlük Kullanım</h2>
            <div className="space-y-3">
              {usage.dailyUsage.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#0a0a1a] rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm text-gray-400 mb-1">{day.date}</div>
                    <div className="flex gap-6 text-sm">
                      <span className="text-gray-300">İstek: <strong className="text-white">{day.requests}</strong></span>
                      <span className="text-gray-300">Token: <strong className="text-white">{day.tokens.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <div className="w-32 bg-[#121225] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                      style={{ width: `${(day.tokens / 100000) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

