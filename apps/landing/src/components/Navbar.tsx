import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <Logo className="w-10 h-10" />
            <span className="text-2xl font-bold gradient-text">
              CodexFlow
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-gray-300 hover:text-purple-400 transition font-medium">
              Özellikler
            </Link>
            <Link href="/how-it-works" className="text-gray-300 hover:text-purple-400 transition font-medium">
              Nasıl Çalışır
            </Link>
            <Link href="/roo-code" className="text-gray-300 hover:text-purple-400 transition font-medium">
              VS Code Extension
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-purple-400 transition font-medium">
              Hakkımızda
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://dashbord.roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/login"
                className="text-gray-300 hover:text-purple-400 transition font-medium"
              >
                Giriş Yap
              </Link>
              <Link
                href="https://dashbord.roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/register"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:-translate-y-0.5"
              >
                Kayıt Ol
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
