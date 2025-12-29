'use client'

import { useState } from 'react'

export default function Dashboard() {
  const [task, setTask] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRun = async () => {
    if (!task.trim()) return

    setLoading(true)
    setResult('')

    try {
      // API call to orchestrator (via internal network)
      const response = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task }),
      })

      const data = await response.json()
      setResult(data.result || data.error || 'Sonuç alınamadı')
    } catch (error) {
      setResult(`Hata: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">Roo Code Dashboard</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Görev
            </label>
            <textarea
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Örn: Create a simple REST API endpoint"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <button
            onClick={handleRun}
            disabled={loading || !task.trim()}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Çalışıyor...' : 'Çalıştır (Plan → Code → Review)'}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h2 className="font-bold mb-2">Sonuç:</h2>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

