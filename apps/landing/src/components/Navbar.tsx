import Link from 'next/link'
import Logo from './Logo'

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Roo Code
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-indigo-600 transition font-medium">
              Ana Sayfa
            </Link>
            <Link href="/how-it-works" className="text-gray-700 hover:text-indigo-600 transition font-medium">
              Nasıl Kullanılır
            </Link>
            <Link href="/roo-code" className="text-gray-700 hover:text-indigo-600 transition font-medium">
              Roo Code
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600 transition font-medium">
              Hakkımızda
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600 transition font-medium">
              İletişim
            </Link>
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

