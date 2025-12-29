'use client'

import Sidebar from '@/components/Sidebar'
import StatsCard from '@/components/StatsCard'

export default function Analytics() {
  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Analitik</h1>
            <p className="text-gray-400">Detaylı kullanım analizi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Ortalama Yanıt Süresi"
              value="1.8s"
              change="-0.2s"
              icon="⚡"
              gradient="bg-gradient-to-r from-indigo-600 to-purple-600"
            />
            <StatsCard
              title="Başarı Oranı"
              value="99.2%"
              change="+0.5%"
              icon="✅"
              gradient="bg-gradient-to-r from-green-500 to-emerald-500"
            />
            <StatsCard
              title="Ortalama Token/İstek"
              value="3,456"
              icon="🔢"
              gradient="bg-gradient-to-r from-purple-600 to-pink-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Günlük İstek Trendi</h2>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p>Grafik yakında eklenecek</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Endpoint Dağılımı</h2>
              <div className="h-64 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Grafik yakında eklenecek</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

