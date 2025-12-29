export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            Roo Code Test Harness
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Planner → Coder → Reviewer workflow with LiteLLM + OpenRouter
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Dashboard'a Git
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-2">📋 Planner</h3>
            <p className="text-gray-600">
              Görevleri adım adım planlara dönüştürür
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-2">💻 Coder</h3>
            <p className="text-gray-600">
              Planları production-ready koda dönüştürür
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-2xl font-bold mb-2">🔍 Reviewer</h3>
            <p className="text-gray-600">
              Kodu gözden geçirir ve iyileştirme önerir
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

