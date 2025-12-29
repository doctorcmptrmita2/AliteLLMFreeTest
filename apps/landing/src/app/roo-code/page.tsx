export default function RooCode() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="bg-effects"></div>
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 relative">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center">VS Code Extension</h1>
          <p className="text-center mt-4 text-purple-100 text-lg">
            CodexFlow VS Code Extension ile entegre kullanım
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">CodexFlow Extension</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              CodexFlow, Visual Studio Code için geliştirilmiş bir extension&apos;dır. 
              Doğrudan editörünüzden AI destekli kod üretimi yapabilirsiniz.
            </p>
            
            <div className="space-y-4">
              <div className="bg-[#0a0a1a] p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-white mb-2">Kurulum</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-300">
                  <li>VS Code MarketPlace&apos;den &quot;CodexFlow&quot; extension&apos;ını yükleyin</li>
                  <li>Extension ayarlarından API anahtarınızı girin</li>
                  <li>Hemen kullanmaya başlayın!</li>
                </ol>
              </div>

              <div className="bg-[#0a0a1a] p-4 rounded-lg border border-white/10">
                <h3 className="font-semibold text-white mb-2">Kullanım</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong className="text-white">Plan Oluştur:</strong> Command Palette&apos;den &quot;CodexFlow: Plan&quot; komutunu çalıştırın</li>
                  <li><strong className="text-white">Kod Üret:</strong> Planınızı kullanarak &quot;CodexFlow: Code&quot; ile kod üretin</li>
                  <li><strong className="text-white">Gözden Geçir:</strong> &quot;CodexFlow: Review&quot; ile kodunuzu analiz edin</li>
                  <li><strong className="text-white">Tam Pipeline:</strong> &quot;CodexFlow: Run&quot; ile tüm süreci tek seferde çalıştırın</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Özellikler</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">✨ Kolay Kullanım</h3>
                <p className="text-gray-300">
                  Command Palette üzerinden kolayca erişilebilir komutlar
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🚀 Hızlı</h3>
                <p className="text-gray-300">
                  Optimize edilmiş API çağrıları ile hızlı sonuçlar
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">🔒 Güvenli</h3>
                <p className="text-gray-300">
                  API anahtarlarınız güvenli bir şekilde saklanır
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">📊 İzlenebilir</h3>
                <p className="text-gray-300">
                  Tüm işlemlerinizi dashboard üzerinden takip edin
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 border-purple-500/50">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Hemen Başlayın</h2>
            <p className="text-lg mb-6 text-gray-300">
              CodexFlow Extension&apos;ı yükleyin ve profesyonel kod üretimine başlayın.
            </p>
            <div className="flex gap-4">
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
              >
                Dashboard&apos;a Git
              </a>
              <a
                href="/how-it-works"
                className="glass text-white px-6 py-3 rounded-lg font-semibold hover:border-purple-500/50 transition"
              >
                Nasıl Çalışır?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
