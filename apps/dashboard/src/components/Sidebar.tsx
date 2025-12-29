'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/api-keys', label: 'API Keys', icon: '🔑' },
    { href: '/logs', label: 'İstek Logları', icon: '📝' },
    { href: '/analytics', label: 'Analitik', icon: '📈' },
    { href: '/usage', label: 'Kullanım', icon: '💳' },
  ]

  return (
    <aside className="w-64 glass border-r border-white/10 h-screen fixed left-0 top-0 p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold gradient-text">CodexFlow</h1>
        <p className="text-sm text-gray-400 mt-1">API Dashboard</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-purple-500/50 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

