# Reasoning ve Caching Rehberi

## 📋 İçindekiler
1. [Prompt Caching](#prompt-caching)
2. [Reasoning Tokens](#reasoning-tokens)
3. [Reasoning Kapatmanın Dezavantajları](#reasoning-kapatmanın-dezavantajları)
4. [Öneriler](#öneriler)

---

## 🔄 Prompt Caching

### Ne İşe Yarar?
Prompt caching, aynı prompt için tekrar eden isteklerde maliyeti %50-90 azaltabilir. Özellikle:
- Sistem promptları (her istekte aynı)
- Tekrar eden kullanıcı sorguları
- Test senaryoları

### Nasıl Çalışır?
1. İlk istekte prompt işlenir ve cache'e kaydedilir
2. Sonraki aynı prompt isteklerinde cache'den okunur
3. Sadece yeni/değişen kısımlar işlenir

### Maliyet Tasarrufu
- **Örnek**: 10K token'lık sistem prompt
- **Cache olmadan**: Her istekte 10K token işlenir
- **Cache ile**: İlk istekte 10K, sonrakilerde ~100 token (sadece yeni kısım)
- **Tasarruf**: %90+ maliyet azalması

### Yapılandırma
`litellm_config.yaml` dosyasına eklendi:
```yaml
litellm_settings:
  cache:
    type: "redis"  # Redis kullan (varsa), yoksa in_memory
    ttl: 3600      # 1 saat cache süresi
    prompt_cache: true
    completion_cache: true
```

### Önemli Notlar
- ✅ Redis varsa otomatik kullanılır
- ✅ Redis yoksa in-memory cache kullanılır
- ⚠️ Cache TTL: 1 saat (ayarlanabilir)
- ⚠️ Dinamik içerikler için cache'i bypass edin

---

## 🧠 Reasoning Tokens

### Ne İşe Yarar?
Reasoning tokens, modellerin düşünme sürecini temsil eder. Bazı modeller (DeepSeek V3.2, MiniMax M2.1) bu özelliği destekler.

### Hangi Modeller Kullanıyor?
Loglarınızdan görüldüğü üzere:
- **DeepSeek V3.2**: Reasoning tokens kullanıyor (328, 121, 0 reasoning tokens)
- **MiniMax M2.1**: Reasoning tokens kullanıyor (133, 55 reasoning tokens)
- **Gemini 2.5 Flash**: Reasoning tokens yok (0)

### Maliyet Etkisi
- Reasoning tokens **ek maliyet** oluşturur
- Ancak **daha iyi sonuçlar** verir
- Karmaşık görevlerde **gerekli** olabilir

### Örnek Maliyet (DeepSeek V3.2)
```
Normal token: $0.00000028/input, $0.0000004/output
Reasoning token: Genellikle normal token maliyetine yakın
```

---

## ⚠️ Reasoning Kapatmanın Dezavantajları

### 1. **Kod Kalitesi Düşer**
- ❌ Daha az düşünülmüş çözümler
- ❌ Hata oranı artar
- ❌ Edge case'ler gözden kaçar

### 2. **Karmaşık Görevlerde Başarısızlık**
- ❌ Çok adımlı problemlerde başarısız olur
- ❌ Algoritma tasarımında zorlanır
- ❌ Debugging yeteneği azalır

### 3. **Tool Calling Performansı Düşer**
- ❌ Hangi tool'u kullanacağını daha az düşünür
- ❌ Tool parametrelerinde hata yapma riski artar
- ❌ Tool chain'lerde mantık hataları olur

### 4. **Kod Review Kalitesi Azalır**
- ❌ Yüzeysel review yapar
- ❌ Potansiyel bug'ları kaçırır
- ❌ İyileştirme önerileri azalır

### 5. **CF-X Workflow'da Sorunlar**
CF-X 3-katmanlı workflow'da:
- **Plan aşaması**: Reasoning gerekli (karmaşık analiz)
- **Code aşaması**: Reasoning faydalı (doğru kod üretimi)
- **Review aşaması**: Reasoning kritik (detaylı analiz)

### Ne Zaman Kapatılabilir?
✅ **Basit görevlerde**: Tek satırlık kod, basit dönüşümler
✅ **Hız kritikse**: Real-time uygulamalar
✅ **Maliyet çok önemliyse**: Basit görevler için

❌ **Kapatılmamalı**: Kodlama, debugging, karmaşık problemler

---

## 💡 Öneriler

### 1. **Caching Stratejisi**
```yaml
# Sistem promptları için cache kullan
# Kullanıcı input'ları için cache kullanma (dinamik)
```

### 2. **Reasoning Stratejisi**
- **CF-X-Normal**: Reasoning açık (DeepSeek V3.2)
- **CF-X-Premium**: Reasoning açık (Claude Sonnet 4.5)
- **CF-X-Cheap**: Reasoning kapalı (GPT-4o-mini - zaten yok)

### 3. **Maliyet Optimizasyonu**
1. ✅ **Cache açık** (eklendi)
2. ✅ **Reasoning açık** (kalite için gerekli)
3. ✅ **Model seçimi**: DeepSeek V3.2 hem ucuz hem güçlü
4. ✅ **Fallback chain**: Ücretsiz modellere düş

### 4. **Monitoring**
- Cache hit rate'i izle
- Reasoning token kullanımını takip et
- Maliyet-performans dengesini ölç

---

## 📊 Karşılaştırma Tablosu

| Özellik | Cache Açık | Cache Kapalı | Reasoning Açık | Reasoning Kapalı |
|---------|-----------|--------------|----------------|------------------|
| **Maliyet** | Düşük | Yüksek | Orta-Yüksek | Düşük |
| **Hız** | Hızlı | Yavaş | Yavaş | Hızlı |
| **Kalite** | Aynı | Aynı | Yüksek | Düşük |
| **Karmaşık Görevler** | ✅ | ✅ | ✅ | ❌ |
| **Basit Görevler** | ✅ | ✅ | ⚠️ | ✅ |

---

## 🔧 Teknik Detaylar

### Reasoning'i Kapatmak İçin
Eğer gerçekten kapatmak isterseniz (önerilmez):

```typescript
// orchestrator/src/client.ts içinde
const request: LiteLLMRequest = {
  model: 'openrouter/deepseek/deepseek-v3.2',
  // Reasoning'i kapat (sadece destekleyen modellerde)
  reasoning_effort: 'low',  // veya 'none' (varsa)
  // ...
};
```

⚠️ **Uyarı**: Bu parametre tüm modellerde desteklenmeyebilir ve kaliteyi düşürür.

### Cache Kontrolü
```typescript
// Cache'i bypass etmek için (dinamik içeriklerde)
const request: LiteLLMRequest = {
  model: '...',
  cache: false,  // Bu istek için cache kullanma
  // ...
};
```

---

## 📝 Sonuç

1. ✅ **Prompt caching açıldı** - Maliyet tasarrufu sağlayacak
2. ✅ **Reasoning açık kalmalı** - Kod kalitesi için kritik
3. ✅ **Model seçimi önemli** - DeepSeek V3.2 hem ucuz hem güçlü
4. ✅ **Monitoring yapın** - Cache hit rate ve reasoning token kullanımını izleyin

**Önerilen Ayarlar:**
- ✅ Cache: **AÇIK** (maliyet tasarrufu)
- ✅ Reasoning: **AÇIK** (kalite için gerekli)
- ✅ Model: **DeepSeek V3.2** (CF-X-Normal için)

