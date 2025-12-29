import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold text-white">Roo Code</span>
            </div>
            <p className="text-sm">
              API satışı ile profesyonel kod yazımı. Planner → Coder → Reviewer workflow ile kaliteli yazılım geliştirme.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-indigo-400 transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-indigo-400 transition">
                  Nasıl Kullanılır
                </Link>
              </li>
              <li>
                <Link href="/roo-code" className="hover:text-indigo-400 transition">
                  Roo Code
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Kurumsal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-400 transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@roocode.com</li>
              <li>API Desteği: api@roocode.com</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2025 Roo Code. Tüm hakları saklıdır. ada</p>
        </div>
      </div>
    </footer>
  )
}

