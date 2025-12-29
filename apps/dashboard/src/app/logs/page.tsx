'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function Logs() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
    // Refresh every 10 seconds
    const interval = setInterval(fetchLogs, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/logs?limit=100')
      if (response.ok) {
        const data = await response.json()
        if (data.error) {
          setError(data.error)
          setLogs([])
        } else {
          setLogs(data)
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to fetch logs' }))
        setError(errorData.error || `HTTP ${response.status}`)
        setLogs([])
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
      setLogs([])
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

          {error && (
            <div className="glass rounded-2xl p-6 mb-6 border-red-500/50">
              <div className="text-red-400 font-semibold mb-2">Hata:</div>
              <div className="text-gray-300 text-sm">{error}</div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : logs.length === 0 && !error ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">Henüz log yok</div>
              <div className="text-sm text-gray-500">LiteLLM'den loglar çekiliyor...</div>
            </div>
          ) : logs.length > 0 ? (
            <div className="glass rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0a0a1a]">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Zaman</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Request ID</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Maliyet</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Süre</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Key Hash</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Key Name</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Model</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">Token</th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition">
                        <td className="px-4 py-4 text-sm text-gray-300">{log.timestamp}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            log.status >= 200 && log.status < 300
                              ? 'bg-green-500/20 text-green-400'
                              : log.status >= 400 && log.status < 500
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {log.status >= 200 && log.status < 300 ? 'Success' : log.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-blue-400 font-mono cursor-pointer hover:text-blue-300">
                          {log.requestId || log.id}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          {log.cost > 0 ? `$${log.cost.toFixed(4)}` : '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{log.duration}</td>
                        <td className="px-4 py-4 text-sm text-gray-400 font-mono text-xs">
                          {log.keyHash || log.apiKey || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          {log.keyName || '-'}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-300">{log.model}</td>
                        <td className="px-4 py-4 text-sm text-gray-300">
                          {log.tokens.toLocaleString()}
                          {log.promptTokens && log.completionTokens && (
                            <span className="text-xs text-gray-500 ml-1 block">
                              ({log.promptTokens}+{log.completionTokens})
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-400">{log.user || 'default_user_id'}</td>
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

