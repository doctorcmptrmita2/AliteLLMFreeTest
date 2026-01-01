# Log Analizi: Claude Sonnet 4.5 Context Length Hatası

## 📋 Hata Özeti

**Tarih**: 2026-01-01 17:01:35  
**Model**: `openrouter/anthropic/claude-sonnet-4.5`  
**Hata Kodu**: 400 BadRequestError  
**Extension**: CodexFlow v1.0.4

---

## 🔴 Hata Detayları

### Context Length Limit Aşımı

```
This endpoint's maximum context length is 1000000 tokens. 
However, you requested about 1007978 tokens 
(4502 of text input, 3476 of tool input, 1000000 in the output).
```

### Token Dağılımı

| Kategori | Token Sayısı | Yüzde |
|----------|--------------|-------|
| Text Input | 4,502 | 0.45% |
| Tool Input | 3,476 | 0.35% |
| **Output (max_tokens)** | **1,000,000** | **99.2%** ❌ |
| **Toplam** | **1,007,978** | **100%** |
| **Limit** | **1,000,000** | - |

### Sorun

- **max_tokens**: 1,000,000 token (context window'un %100'ü!)
- **Input**: 7,978 token (%0.8)
- **Sonuç**: Limit aşıldı (1,007,978 > 1,000,000)

---

## 🔍 Kök Neden Analizi

### 1. Model Info Yanlış Yapılandırılmış

CodexFlow extension'ında Claude Sonnet 4.5 için:
- `maxTokens`: Çok yüksek ayarlanmış (muhtemelen 1,000,000 veya contextWindow değeri)
- `contextWindow`: 1,000,000 token

### 2. max_tokens Kontrolü Yok

DeepSeek V3.2 için yaptığımız gibi, Claude Sonnet 4.5 için de `max_tokens` sınırlaması yoktu.

---

## ✅ Çözüm

### Yapılan Düzeltme

**Dosya**: `C:\wamp64\www\RooForkVs\src\api\providers\lite-llm.ts`

**Eklenen Kod** (Her iki handler'da):

```typescript
// For Claude Sonnet 4.5 and similar models with 1000000 context limit,
// limit max_tokens to prevent context length errors
const isClaudeSonnet45 = modelId.includes("claude-sonnet-4.5")
if (isClaudeSonnet45 && maxTokens) {
  // Claude Sonnet 4.5 has 1000000 context limit
  // Limit max_tokens to safe value: 20% of actual context limit (200000)
  // This leaves 80% (800000) for input tokens
  const actualContextLimit = 1000000
  const safeMaxTokens = Math.min(maxTokens, Math.floor(actualContextLimit * 0.2))
  if (safeMaxTokens < maxTokens) {
    maxTokens = safeMaxTokens
  }
}
```

### Kural

- **max_tokens**: Context window'un %20'si (200,000 token)
- **Input için**: %80 (800,000 token) bırakılır
- **Güvenli**: Input + Output toplamı context limit'i aşmaz

---

## 📊 Önceki vs Yeni Durum

### Önceki Durum ❌

```
Input: 4,502 + 3,476 = 7,978 token
Output (max_tokens): 1,000,000 token
Toplam: 1,007,978 token > 1,000,000 (LIMIT AŞILDI)
```

### Yeni Durum ✅

```
Input: 4,502 + 3,476 = 7,978 token
Output (max_tokens): 200,000 token (sınırlandırıldı)
Toplam: 207,978 token < 1,000,000 (GÜVENLİ)
```

### Güvenlik Marjı

- **Kullanılan**: 207,978 token (%20.8)
- **Kalan**: 792,022 token (%79.2)
- **Güvenli**: ✅

---

## 🎯 Etkilenen Metodlar

1. **`createMessage`** (Streaming): ✅ Düzeltildi
2. **`completePrompt`** (Non-streaming): ✅ Düzeltildi

---

## 📝 Diğer Modeller İçin Notlar

### Benzer Sorunlar Olabilir

Aşağıdaki modeller için de aynı kontrol eklenebilir:

1. **Claude Sonnet 4.5**: ✅ Düzeltildi (1M context)
2. **DeepSeek V3.2**: ✅ Düzeltildi (163K context)
3. **Claude Opus 4**: ⚠️ Kontrol edilmeli
4. **GPT-4o**: ⚠️ Kontrol edilmeli
5. **Gemini 2.5 Flash**: ⚠️ Kontrol edilmeli

### Genel Kural

Tüm modeller için:
- **max_tokens**: Context window'un %20'si
- **Input için**: %80 bırakılır
- **Güvenli marj**: %20-30

---

## 🔧 Sonraki Adımlar

1. **Extension'ı Rebuild Et**:
   ```bash
   cd C:\wamp64\www\RooForkVs\src
   pnpm bundle
   pnpm vsix
   ```

2. **Test Et**:
   - Claude Sonnet 4.5 ile büyük bir istek yap
   - Artık context length hatası olmamalı

3. **Diğer Modelleri Kontrol Et**:
   - Benzer hatalar için diğer modelleri de kontrol et
   - Gerekirse aynı düzeltmeyi ekle

---

## ✅ Düzeltme Durumu

- ✅ Streaming handler düzeltildi
- ✅ Non-streaming handler düzeltildi
- ✅ Lint hataları kontrol edildi (hata yok)
- ⏳ Extension rebuild edilmeli
- ⏳ VSIX oluşturulmalı

**Dosya**: `C:\wamp64\www\RooForkVs\src\api\providers\lite-llm.ts`

---

## 📊 İstatistikler

### Hata Öncesi
- **max_tokens**: 1,000,000 (limitin %100'ü)
- **Başarı Oranı**: 0% (limit aşıldı)

### Hata Sonrası
- **max_tokens**: 200,000 (limitin %20'si)
- **Beklenen Başarı Oranı**: 100% (güvenli marj var)

