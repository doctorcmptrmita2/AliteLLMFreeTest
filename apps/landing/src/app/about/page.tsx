export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">Hakkımızda</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Misyonumuz</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Roo Code, yazılım geliştirme sürecini demokratikleştirmeyi ve herkesin 
              kaliteli, production-ready kod üretebilmesini sağlamayı hedefler. 
              AI destekli Planner → Coder → Reviewer workflow'umuz ile, 
              geliştiricilerin zamandan tasarruf etmesini ve daha iyi sonuçlar 
              elde etmesini sağlıyoruz.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Vizyonumuz</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Gelecekte, yazılım geliştirme sürecinde AI'nın insan geliştiricilerle 
              mükemmel bir uyum içinde çalıştığı bir ekosistem hayal ediyoruz. 
              Roo Code, bu geleceğin temel taşlarından biri olmayı hedefliyor.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Teknoloji</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              Roo Code, modern teknolojiler ve AI modelleri kullanarak geliştirilmiştir:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>LiteLLM:</strong> Çoklu model desteği ve esnek API yönetimi</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>OpenRouter:</strong> En iyi AI modellerine erişim</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>TypeScript:</strong> Tip güvenliği ve modern JavaScript</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>Next.js:</strong> Modern web uygulamaları için framework</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Ekip</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Roo Code, yazılım geliştirme ve AI alanında deneyimli bir ekip tarafından 
              geliştirilmektedir. Amacımız, geliştiricilerin hayatını kolaylaştırmak 
              ve yazılım geliştirme sürecini daha verimli hale getirmektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

