'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function APIKeys() {
  const [keys, setKeys] = useState([
    { id: 1, name: 'Production Key', key: 'sk-...abc123', created: '2025-01-15', requests: 1247, status: 'active' },
    { id: 2, name: 'Development Key', key: 'sk-...def456', created: '2025-01-10', requests: 89, status: 'active' },
  ])

  const [showNewKey, setShowNewKey] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')

  const generateKey = () => {
    const newKey = {
      id: keys.length + 1,
      name: newKeyName || 'New API Key',
      key: `sk-${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      created: new Date().toISOString().split('T')[0],
      requests: 0,
      status: 'active',
    }
    setKeys([...keys, newKey])
    setShowNewKey(false)
    setNewKeyName('')
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a1a]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">API Keys</h1>
              <p className="text-gray-400">API anahtarlarınızı yönetin</p>
            </div>
            <button
              onClick={() => setShowNewKey(true)}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
            >
              + Yeni API Key
            </button>
          </div>

          {showNewKey && (
            <div className="glass rounded-2xl p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Yeni API Key Oluştur</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="API Key adı (opsiyonel)"
                  className="w-full px-4 py-3 bg-[#0a0a1a] border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                />
                <div className="flex gap-4">
                  <button
                    onClick={generateKey}
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
                  >
                    Oluştur
                  </button>
                  <button
                    onClick={() => {
                      setShowNewKey(false)
                      setNewKeyName('')
                    }}
                    className="glass text-white px-6 py-3 rounded-lg font-semibold hover:border-purple-500/50 transition"
                  >
                    İptal
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {keys.map((key) => (
              <div key={key.id} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold">{key.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        key.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {key.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[#0a0a1a] px-3 py-1 rounded">{key.key}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(key.key)}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          📋
                        </button>
                      </div>
                      <span>Oluşturulma: {key.created}</span>
                      <span>İstek: {key.requests.toLocaleString()}</span>
                    </div>
                  </div>
                  <button className="text-red-400 hover:text-red-300 px-4 py-2">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

