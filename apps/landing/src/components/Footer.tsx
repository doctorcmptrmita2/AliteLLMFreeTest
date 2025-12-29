import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0a0a1a]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold gradient-text">CodexFlow</span>
            </div>
            <p className="text-sm text-gray-400">
              AI destekli kod yazımı. Planner → Coder → Reviewer workflow ile kaliteli yazılım geliştirme.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-gray-400 hover:text-purple-400 transition">
                  Nasıl Çalışır
                </Link>
              </li>
              <li>
                <Link href="/roo-code" className="text-gray-400 hover:text-purple-400 transition">
                  VS Code Extension
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-purple-400 transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Email: info@codexflow.dev</li>
              <li>API: api@codexflow.dev</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 CodexFlow.dev. Tüm hakları saklıdır. ada</p>
        </div>
      </div>
    </footer>
  )
}
