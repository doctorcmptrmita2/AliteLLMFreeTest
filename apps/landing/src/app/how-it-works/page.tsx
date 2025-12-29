export default function HowItWorks() {
  const jsonExample1 = '{"task": "Create a REST API endpoint"}'
  const jsonExample2 = '{"task": "...", "plan": "..."}'
  const jsonExample3 = '{"task": "...", "plan": "...", "code": "..."}'
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">Nasıl Kullanılır?</h1>
          <p className="text-center mt-4 text-indigo-100 text-lg">
            Roo Code&apos;u kullanarak profesyonel kod üretin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                  1
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">API&apos;ye Bağlan</h2>
                  <p className="text-gray-600 text-lg mb-4">
                    Roo Code API&apos;sine bağlanmak için API anahtarınızı alın. Dashboard üzerinden 
                    kolayca API anahtarı oluşturabilirsiniz.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <code>curl -X POST https://api.roocode.com/v1/plan \</code><br />
                    <code className="pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
                    <code className="pl-4">-d &apos;{jsonExample1}&apos;</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                  2
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Plan Oluştur</h2>
                  <p className="text-gray-600 text-lg mb-4">
                    Yapmak istediğiniz görevi tanımlayın. Planner görevi analiz eder ve 
                    detaylı bir plan oluşturur.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Örnek Görev:</strong> &quot;Create a user authentication system with JWT tokens&quot;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                  3
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Kod Üret</h2>
                  <p className="text-gray-600 text-lg mb-4">
                    Planı kullanarak kod üretin. Coder, planı alır ve production-ready kod üretir.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <code>curl -X POST https://api.roocode.com/v1/code \</code><br />
                    <code className="pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
                    <code className="pl-4">-d &apos;{jsonExample2}&apos;</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                  4
                </div>
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold mb-4 text-gray-900">Gözden Geçir</h2>
                  <p className="text-gray-600 text-lg mb-4">
                    Reviewer kodu analiz eder ve iyileştirme önerileri sunar. 
                    Kalite garantisi sağlar.
                  </p>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    <code>curl -X POST https://api.roocode.com/v1/review \</code><br />
                    <code className="pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
                    <code className="pl-4">-d &apos;{jsonExample3}&apos;</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Pipeline */}
          <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Tam Pipeline</h2>
            <p className="text-lg mb-6 text-indigo-100">
              Tüm süreci tek bir API çağrısıyla çalıştırabilirsiniz:
            </p>
            <div className="bg-indigo-700/50 p-4 rounded-lg font-mono text-sm">
              <code>curl -X POST https://api.roocode.com/v1/run \</code><br />
              <code className="pl-4">-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \</code><br />
              <code className="pl-4">-d &apos;{jsonExample1}&apos;</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
