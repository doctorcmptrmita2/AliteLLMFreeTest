# CF-X Model - 3 Katmanlı AI Kodlama Sistemi

## 🎯 CF-X Model Nedir?

CF-X, 3 farklı AI modelini sırayla kullanarak en iyi sonucu üreten özel bir kodlama modelidir.

### Katmanlar

1. **📋 Planlama (DeepSeek V3.2)**
   - Görevi analiz eder
   - Adım adım plan oluşturur
   - En iyi reasoning yeteneği

2. **💻 Kodlama (MiniMax M2.1)**
   - Plan'a göre kod yazar
   - Coding için optimize edilmiş
   - 204K context window
   - Hafif ve hızlı

3. **🔍 İnceleme (Gemini 2.5 Flash)**
   - Yazılan kodu gözden geçirir
   - Hataları tespit eder
   - İyileştirme önerileri sunar
   - 1M context window

## 🚀 Kullanım

### Orchestrator CLI ile

```bash
# CF-X modelini kullan
docker-compose run --rm orchestrator run "Your task here" --cf-x
```

### Örnek

```bash
docker-compose run --rm orchestrator run "Create a REST API endpoint for user registration" --cf-x
```

## 📊 Avantajlar

- ✅ **En İyi Planlama**: DeepSeek V3.2 ile detaylı plan
- ✅ **Optimize Kodlama**: MiniMax M2.1 ile coding için optimize
- ✅ **Kapsamlı İnceleme**: Gemini 2.5 Flash ile hata kontrolü
- ✅ **Yüksek Kalite**: Her katman kendi uzmanlığında çalışır

## 🔧 Teknik Detaylar

### Model Özellikleri

| Katman | Model | Context | Özellik |
|--------|-------|---------|---------|
| Plan | DeepSeek V3.2 | 128K | Reasoning, planning |
| Code | MiniMax M2.1 | 204K | Coding optimized |
| Review | Gemini 2.5 Flash | 1M | Code review, analysis |

### İş Akışı

```
Task Input
    ↓
[DeepSeek V3.2] → Plan
    ↓
[MiniMax M2.1] → Code
    ↓
[Gemini 2.5 Flash] → Review
    ↓
Final Output
```

## 💡 Neden CF-X?

- Her model kendi uzmanlığında çalışır
- Planlama için reasoning modeli
- Kodlama için coding-optimized model
- İnceleme için büyük context window
- Sonuç: Daha kaliteli kod

