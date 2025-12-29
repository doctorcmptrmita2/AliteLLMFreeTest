import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              API ile Profesyonel Kod Yazımı
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-indigo-100">
              Planner → Coder → Reviewer workflow ile kaliteli, production-ready yazılım geliştirin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition shadow-lg hover:shadow-xl"
              >
                Hemen Başla
              </Link>
              <Link
                href="/how-it-works"
                className="bg-indigo-700/50 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-800/50 transition border border-indigo-400"
              >
                Nasıl Çalışır?
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Güçlü Özellikler
            </h2>
            <p className="text-xl text-gray-600">
              AI destekli workflow ile profesyonel kod üretimi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Planner</h3>
              <p className="text-gray-600">
                Görevlerinizi detaylı planlara dönüştürür. Her adımı analiz eder ve en iyi yaklaşımı belirler.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">💻</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Coder</h3>
              <p className="text-gray-600">
                Planları production-ready koda dönüştürür. Best practices ve modern standartlara uygun kod üretir.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Reviewer</h3>
              <p className="text-gray-600">
                Kodu gözden geçirir, hataları tespit eder ve iyileştirme önerileri sunar. Kalite garantisi sağlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-600">
              3 basit adımda profesyonel kod üretin
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Görevi Tanımla</h3>
                  <p className="text-gray-600">
                    Yapmak istediğiniz projeyi veya özelliği doğal dilde tanımlayın. Planner görevi analiz eder ve detaylı bir plan oluşturur.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Kod Üret</h3>
                  <p className="text-gray-600">
                    Coder, planı alır ve modern, temiz, production-ready kod üretir. Best practices ve güvenlik standartlarına uygun.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">Gözden Geçir</h3>
                  <p className="text-gray-600">
                    Reviewer kodu analiz eder, potansiyel sorunları tespit eder ve iyileştirme önerileri sunar. Kalite garantisi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl mb-8 text-indigo-100">
            API ile profesyonel kod yazımına bugün başlayın
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition shadow-lg"
          >
            Dashboard'a Git
          </Link>
        </div>
      </section>
    </div>
  )
}
