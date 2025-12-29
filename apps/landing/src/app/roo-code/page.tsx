export default function RooCode() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">Roo Code Kullanımı</h1>
          <p className="text-center mt-4 text-indigo-100 text-lg">
            VS Code Extension ile entegre kullanım
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Roo Code Extension</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Roo Code, Visual Studio Code için geliştirilmiş bir extension'dır. 
              Doğrudan editörünüzden AI destekli kod üretimi yapabilirsiniz.
            </p>
            
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Kurulum</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>VS Code MarketPlace'den "Roo Code" extension'ını yükleyin</li>
                  <li>Extension ayarlarından API anahtarınızı girin</li>
                  <li>Hemen kullanmaya başlayın!</li>
                </ol>
              </div>

              <div className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Kullanım</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Plan Oluştur:</strong> Command Palette'den "Roo Code: Plan" komutunu çalıştırın</li>
                  <li><strong>Kod Üret:</strong> Planınızı kullanarak "Roo Code: Code" ile kod üretin</li>
                  <li><strong>Gözden Geçir:</strong> "Roo Code: Review" ile kodunuzu analiz edin</li>
                  <li><strong>Tam Pipeline:</strong> "Roo Code: Run" ile tüm süreci tek seferde çalıştırın</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Özellikler</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">✨ Kolay Kullanım</h3>
                <p className="text-gray-600">
                  Command Palette üzerinden kolayca erişilebilir komutlar
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🚀 Hızlı</h3>
                <p className="text-gray-600">
                  Optimize edilmiş API çağrıları ile hızlı sonuçlar
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">🔒 Güvenli</h3>
                <p className="text-gray-600">
                  API anahtarlarınız güvenli bir şekilde saklanır
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📊 İzlenebilir</h3>
                <p className="text-gray-600">
                  Tüm işlemlerinizi dashboard üzerinden takip edin
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Hemen Başlayın</h2>
            <p className="text-lg mb-6 text-indigo-100">
              Roo Code Extension'ı yükleyin ve profesyonel kod üretimine başlayın.
            </p>
            <div className="flex gap-4">
              <a
                href="/dashboard"
                className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition"
              >
                Dashboard'a Git
              </a>
              <a
                href="/how-it-works"
                className="bg-indigo-700/50 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-800/50 transition border border-indigo-400"
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

