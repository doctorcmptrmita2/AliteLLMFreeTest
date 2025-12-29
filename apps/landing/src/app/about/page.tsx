export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="bg-effects"></div>
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 relative">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center">Hakkımızda</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Misyonumuz</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              CodexFlow, yazılım geliştirme sürecini demokratikleştirmeyi ve herkesin 
              kaliteli, production-ready kod üretebilmesini sağlamayı hedefler. 
              AI destekli Planner → Coder → Reviewer workflow&apos;umuz ile, 
              geliştiricilerin zamandan tasarruf etmesini ve daha iyi sonuçlar 
              elde etmesini sağlıyoruz.
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Vizyonumuz</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Gelecekte, yazılım geliştirme sürecinde AI&apos;nın insan geliştiricilerle 
              mükemmel bir uyum içinde çalıştığı bir ekosistem hayal ediyoruz. 
              CodexFlow, bu geleceğin temel taşlarından biri olmayı hedefliyor.
            </p>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Teknoloji</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-4">
              CodexFlow, modern teknolojiler ve AI modelleri kullanarak geliştirilmiştir:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong className="text-white">LiteLLM:</strong> Çoklu model desteği ve esnek API yönetimi</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong className="text-white">OpenRouter:</strong> En iyi AI modellerine erişim</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong className="text-white">TypeScript:</strong> Tip güvenliği ve modern JavaScript</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong className="text-white">Next.js:</strong> Modern web uygulamaları için framework</span>
              </li>
            </ul>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Ekip</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              CodexFlow, yazılım geliştirme ve AI alanında deneyimli bir ekip tarafından 
              geliştirilmektedir. Amacımız, geliştiricilerin hayatını kolaylaştırmak 
              ve yazılım geliştirme sürecini daha verimli hale getirmektir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
