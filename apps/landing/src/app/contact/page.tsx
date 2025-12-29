'use client'

import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form gönderimi burada yapılabilir
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-center">İletişim</h1>
          <p className="text-center mt-4 text-indigo-100 text-lg">
            Sorularınız için bizimle iletişime geçin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">İletişim Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">info@roocode.com</p>
                <p className="text-gray-600">api@roocode.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">API Desteği</h3>
                <p className="text-gray-600">
                  API kullanımı ile ilgili sorularınız için api@roocode.com adresine yazabilirsiniz.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Yanıt Süresi</h3>
                <p className="text-gray-600">
                  Genellikle 24 saat içinde yanıt veriyoruz.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Mesaj Gönder</h2>
            {submitted ? (
              <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Gönder
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

