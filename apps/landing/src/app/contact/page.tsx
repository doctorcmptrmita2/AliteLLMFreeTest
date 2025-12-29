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
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a]">
      <div className="bg-effects"></div>
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-24 relative">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-center">İletişim</h1>
          <p className="text-center mt-4 text-purple-100 text-lg">
            Sorularınız için bizimle iletişime geçin
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text">İletişim Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Email</h3>
                <p className="text-gray-300">info@codexflow.dev</p>
                <p className="text-gray-300">api@codexflow.dev</p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">API Desteği</h3>
                <p className="text-gray-300">
                  API kullanımı ile ilgili sorularınız için api@codexflow.dev adresine yazabilirsiniz.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Yanıt Süresi</h3>
                <p className="text-gray-300">
                  Genellikle 24 saat içinde yanıt veriyoruz.
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 gradient-text">Mesaj Gönder</h2>
            {submitted ? (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 p-4 rounded-lg">
                Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1a1a35] border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1a1a35] border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                    Konu
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1a1a35] border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                    Mesaj
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1a1a35] border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition"
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
