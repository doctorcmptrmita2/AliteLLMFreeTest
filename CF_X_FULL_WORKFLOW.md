# CF-X Model - Tam Verimli Çalışma

## ✅ CF-X Artık Tam Verimli Çalışıyor!

CF-X modeli artık dashboard'dan **tam 3 katmanlı workflow** ile çalışıyor:

### 3 Katmanlı İş Akışı

1. **📋 Plan (DeepSeek V3.2)**
   - Görevi analiz eder
   - Adım adım plan oluşturur
   - Reasoning modeli ile en iyi planlama

2. **💻 Code (MiniMax M2.1)**
   - Plan'a göre kod yazar
   - Coding için optimize edilmiş model
   - Production-ready kod üretir

3. **🔍 Review (Gemini 2.5 Flash)**
   - Yazılan kodu gözden geçirir
   - Hataları tespit eder
   - İyileştirme önerileri sunar
   - 1M context window ile kapsamlı analiz

## Nasıl Çalışıyor?

### Dashboard'dan Kullanım

1. Dashboard'a git
2. "Hızlı Çalıştır" bölümünde **CF-X** modelini seç
3. Task'ı yaz
4. "🚀 CF-X ile Çalıştır (3 Katmanlı)" butonuna tıkla
5. 3 katmanlı sonuç alırsın:
   - Plan (DeepSeek V3.2)
   - Code (MiniMax M2.1)
   - Review (Gemini 2.5 Flash)

### CLI'den Kullanım

```bash
docker-compose run --rm orchestrator run "Your task" --cf-x
```

## Teknik Detaylar

### Dashboard API Endpoint

`/api/run` endpoint'i CF-X için:
1. DeepSeek V3.2 ile plan oluşturur
2. MiniMax M2.1 ile kod yazar
3. Gemini 2.5 Flash ile kodu gözden geçirir
4. Tüm sonuçları birleştirip döner

### Model Sırası

```
Task Input
    ↓
[DeepSeek V3.2] → Plan
    ↓
[MiniMax M2.1] → Code (Plan'a göre)
    ↓
[Gemini 2.5 Flash] → Review (Task + Plan + Code)
    ↓
Final Output (Plan + Code + Review)
```

## Avantajlar

- ✅ **Tam Otomatik**: Dashboard'dan tek tıkla çalışır
- ✅ **3 Katmanlı**: Her katman kendi uzmanlığında
- ✅ **Hata Kontrolü**: Review katmanı hataları yakalar
- ✅ **Yüksek Kalite**: Her model kendi alanında en iyi

## Örnek Kullanım

**Task:** "Create a REST API endpoint for user registration"

**CF-X Sonucu:**
1. **Plan**: Adım adım plan (DeepSeek V3.2)
2. **Code**: Production-ready kod (MiniMax M2.1)
3. **Review**: Hata kontrolü ve öneriler (Gemini 2.5 Flash)

## Not

CF-X artık **tam verimli** çalışıyor! Dashboard'dan seçip kullanabilirsin.

