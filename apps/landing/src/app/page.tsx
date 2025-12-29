import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="bg-effects"></div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  AI ile Kodla,<br />
                  <span className="gradient-text">Hızla Geliştir</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Planner → Coder → Reviewer workflow ile profesyonel, production-ready kod üretin. 
                  API satışı ile kaliteli yazılım geliştirme.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-12">
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:-translate-y-1 text-center"
                  >
                    🚀 Hemen Başla
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="glass text-white px-8 py-4 rounded-xl font-semibold text-lg hover:border-purple-500/50 transition text-center"
                  >
                    📖 Nasıl Çalışır?
                  </Link>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">17+</div>
                    <div className="text-sm text-gray-400">AI Araç</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">5+</div>
                    <div className="text-sm text-gray-400">Proje Şablonu</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text">%60</div>
                    <div className="text-sm text-gray-400">Daha Ucuz</div>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="glass rounded-2xl p-6 shadow-2xl">
                  <div className="code-preview">
                    <div className="code-line">
                      <span className="code-line-number">1</span>
                      <span className="code-comment">// CodexFlow ile oluşturuldu ⚡</span>
                    </div>
                    <div className="code-line">
                      <span className="code-line-number">2</span>
                      <span className="code-keyword">async</span> <span className="code-function">function</span> <span className="code-variable">createProject</span>() {'{'}
                    </div>
                    <div className="code-line">
                      <span className="code-line-number">3</span>
                      &nbsp;&nbsp;<span className="code-keyword">const</span> <span className="code-variable">ai</span> = <span className="code-keyword">new</span> <span className="code-function">CodexFlow</span>();
                    </div>
                    <div className="code-line">
                      <span className="code-line-number">4</span>
                      &nbsp;&nbsp;<span className="code-keyword">await</span> <span className="code-variable">ai</span>.<span className="code-function">execute</span>(<span className="code-string">&quot;React app oluştur&quot;</span>);
                    </div>
                    <div className="code-line">
                      <span className="code-line-number">5</span>
                      {'}'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Güçlü Özellikler
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              AI destekli workflow ile profesyonel kod üretimi
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass rounded-2xl p-8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl mb-4">
                📋
              </div>
              <h3 className="text-2xl font-bold mb-3">Planner</h3>
              <p className="text-gray-300">
                Görevlerinizi detaylı planlara dönüştürür. Her adımı analiz eder ve en iyi yaklaşımı belirler.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-3xl mb-4">
                💻
              </div>
              <h3 className="text-2xl font-bold mb-3">Coder</h3>
              <p className="text-gray-300">
                Planları production-ready koda dönüştürür. Best practices ve modern standartlara uygun kod üretir.
              </p>
            </div>
            
            <div className="glass rounded-2xl p-8 hover:border-purple-500/50 transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-gradient-to-r from-pink-600 to-red-500 rounded-xl flex items-center justify-center text-3xl mb-4">
                🔍
              </div>
              <h3 className="text-2xl font-bold mb-3">Reviewer</h3>
              <p className="text-gray-300">
                Kodu gözden geçirir, hataları tespit eder ve iyileştirme önerileri sunar. Kalite garantisi sağlar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-[#121225] relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Nasıl Çalışır?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              3 basit adımda profesyonel kod üretin
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="glass rounded-2xl p-8 flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Görevi Tanımla</h3>
                  <p className="text-gray-300">
                    Yapmak istediğiniz projeyi veya özelliği doğal dilde tanımlayın. Planner görevi analiz eder ve detaylı bir plan oluşturur.
                  </p>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Kod Üret</h3>
                  <p className="text-gray-300">
                    Coder, planı alır ve modern, temiz, production-ready kod üretir. Best practices ve güvenlik standartlarına uygun.
                  </p>
                </div>
              </div>
              
              <div className="glass rounded-2xl p-8 flex gap-6 items-start">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  3
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Gözden Geçir</h3>
                  <p className="text-gray-300">
                    Reviewer kodu analiz eder, potansiyel sorunları tespit eder ve iyileştirme önerileri sunar. Kalite garantisi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-pulse"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
                Hemen Başlayın
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                API ile profesyonel kod yazımına bugün başlayın
              </p>
              <Link
                href="/dashboard"
                className="inline-block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:-translate-y-1"
              >
                Dashboard&apos;a Git
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
