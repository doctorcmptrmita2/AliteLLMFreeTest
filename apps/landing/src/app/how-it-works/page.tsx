export default function HowItWorks() {
  const jsonExample1 = '{"task": "Create a REST API endpoint"}'
  const jsonExample2 = '{"task": "...", "plan": "..."}'
  const jsonExample3 = '{"task": "...", "plan": "...", "code": "..."}'
  
  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="bg-effects"></div>
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 relative">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center">Nasıl Kullanılır?</h1>
          <p className="text-center mt-4 text-purple-100 text-lg">
            CodexFlow&apos;u kullanarak profesyonel kod üretin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  1
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">API&apos;ye Bağlan</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    CodexFlow API&apos;sine bağlanmak için API anahtarınızı alın. Dashboard üzerinden 
                    kolayca API anahtarı oluşturabilirsiniz.
                  </p>
                  <div className="bg-[#0a0a1a] p-4 rounded-lg font-mono text-sm border border-white/10">
                    <code className="text-gray-300">curl -X POST https://api.codexflow.dev/v1/plan \</code><br />
                    <code className="text-gray-300 pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
                    <code className="text-gray-300 pl-4">-d &apos;{jsonExample1}&apos;</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  2
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">Plan Oluştur</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    Yapmak istediğiniz görevi tanımlayın. Planner görevi analiz eder ve 
                    detaylı bir plan oluşturur.
                  </p>
                  <div className="bg-[#0a0a1a] p-4 rounded-lg border border-white/10">
                    <p className="text-sm text-gray-300">
                      <strong className="text-white">Örnek Görev:</strong> &quot;Create a user authentication system with JWT tokens&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-pink-600 to-red-500 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  3
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">Kod Üret</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    Planı kullanarak kod üretin. Coder, planı alır ve production-ready kod üretir.
                  </p>
                  <div className="bg-[#0a0a1a] p-4 rounded-lg font-mono text-sm border border-white/10">
                    <code className="text-gray-300">curl -X POST https://api.codexflow.dev/v1/code \</code><br />
                    <code className="text-gray-300 pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
                    <code className="text-gray-300 pl-4">-d &apos;{jsonExample2}&apos;</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="glass rounded-2xl p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl flex items-center justify-center font-bold text-2xl">
                  4
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 gradient-text">Gözden Geçir</h2>
                  <p className="text-gray-300 text-lg mb-4">
                    Reviewer kodu analiz eder ve iyileştirme önerileri sunar. 
                    Kalite garantisi sağlar.
                  </p>
                  <div className="bg-[#0a0a1a] p-4 rounded-lg font-mono text-sm border border-white/10">
                    <code className="text-gray-300">curl -X POST https://api.codexflow.dev/v1/review \</code><br />
                    <code className="text-gray-300 pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
                    <code className="text-gray-300 pl-4">-d &apos;{jsonExample3}&apos;</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Pipeline */}
          <div className="mt-16 glass rounded-2xl p-8 border-purple-500/50">
            <h2 className="text-3xl font-bold mb-4 gradient-text">Tam Pipeline</h2>
            <p className="text-lg mb-6 text-gray-300">
              Tüm süreci tek bir API çağrısıyla çalıştırabilirsiniz:
            </p>
            <div className="bg-[#0a0a1a] p-4 rounded-lg font-mono text-sm border border-white/10">
              <code className="text-gray-300">curl -X POST https://api.codexflow.dev/v1/run \</code><br />
              <code className="text-gray-300 pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
              <code className="text-gray-300 pl-4">-d &apos;{jsonExample1}&apos;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
