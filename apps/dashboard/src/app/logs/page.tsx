'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLogs()
    // Refresh every 10 seconds
    const interval = setInterval(fetchLogs, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/logs?limit=100')
      if (response.ok) {
        const data = await response.json()
        setLogs(data)
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400'
    if (status >= 400 && status < 500) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">İstek Logları</h1>
            <p className="text-gray-400">Tüm API isteklerinizi görüntüleyin</p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">Henüz log yok</div>
          ) : (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0a0a1a]">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Zaman</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Endpoint</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Model</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Method</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Token</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Maliyet</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Süre</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">API Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4 text-sm text-gray-300">{log.timestamp}</td>
                        <td className="px-6 py-4 text-sm text-white font-mono">{log.endpoint}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{log.model}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-semibold">
                            {log.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className={getStatusColor(log.status)}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">{log.tokens.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm text-green-400">${log.cost.toFixed(4)}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{log.duration}</td>
                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{log.apiKey}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

