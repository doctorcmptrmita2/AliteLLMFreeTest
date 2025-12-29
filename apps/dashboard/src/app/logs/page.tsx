'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function Logs() {
  const [logs] = useState([
    {
      id: 1,
      timestamp: '2025-01-29 14:23:15',
      endpoint: '/v1/plan',
      method: 'POST',
      status: 200,
      tokens: 1234,
      cost: 0.05,
      duration: '1.2s',
      apiKey: 'sk-...abc123',
    },
    {
      id: 2,
      timestamp: '2025-01-29 14:22:10',
      endpoint: '/v1/code',
      method: 'POST',
      status: 200,
      tokens: 5678,
      cost: 0.12,
      duration: '2.5s',
      apiKey: 'sk-...abc123',
    },
    {
      id: 3,
      timestamp: '2025-01-29 14:20:05',
      endpoint: '/v1/review',
      method: 'POST',
      status: 200,
      tokens: 2345,
      cost: 0.08,
      duration: '1.8s',
      apiKey: 'sk-...def456',
    },
  ])

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

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0a0a1a]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Zaman</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Endpoint</th>
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
        </div>
      </main>
    </div>
  )
}

