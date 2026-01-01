# Context Length Hatası Düzeltmesi

## 🔴 Hata Mesajı

```
400 BadRequestError: This endpoint's maximum context length is 163840 tokens. 
However, you requested about 172900 tokens 
(4429 of text input, 4631 of tool input, 163840 in the output).
```

**Model**: `openrouter/deepseek/deepseek-v3.2`  
**Extension**: CodexFlow v1.0.4

---

## 🔍 Sorun Analizi

### Neden Oluşuyor?

1. **DeepSeek V3.2 Context Limit**: 163840 token (toplam: input + output)
2. **İstek Detayları**:
   - Text input: 4,429 token
   - Tool input: 4,631 token
   - Output (max_tokens): 163,840 token
   - **Toplam**: 172,900 token ❌ (limit: 163,840)

3. **Sorun**: `max_tokens` çok yüksek ayarlanmış
   - Model info'da `maxTokens: 8192` var
   - Ama gerçekte 163,840 token isteniyor
   - Bu, context window'un tamamını output için kullanmaya çalışıyor

---

## ✅ Çözüm

### Yapılan Düzeltme

**Dosya**: `C:\wamp64\www\RooForkVs\src\api\providers\lite-llm.ts`

**Değişiklik**: DeepSeek V3.2 için `max_tokens`'ı güvenli bir değerle sınırlandırma

```typescript
// For DeepSeek V3.2 and similar models with 163840 context limit,
// limit max_tokens to prevent context length errors
const isDeepSeekV32 = modelId.includes("deepseek/deepseek-v3.2")
if (isDeepSeekV32 && maxTokens) {
  // DeepSeek V3.2 has 163840 context limit (not 200000 as configured)
  // Limit max_tokens to safe value: 20% of actual context limit (32768)
  // This leaves 80% (131072) for input tokens
  const actualContextLimit = 163840
  const safeMaxTokens = Math.min(maxTokens, Math.floor(actualContextLimit * 0.2))
  if (safeMaxTokens < maxTokens) {
    maxTokens = safeMaxTokens
  }
}
```

### Kural

- **max_tokens**: Context window'un %20'si (32,768 token)
- **Input için**: %80 (131,072 token) bırakılır
- **Güvenli**: Input + Output toplamı context limit'i aşmaz

---

## 📊 Örnek Hesaplama

### Önceki Durum ❌
```
Input: 4,429 + 4,631 = 9,060 token
Output (max_tokens): 163,840 token
Toplam: 172,900 token > 163,840 (LIMIT AŞILDI)
```

### Yeni Durum ✅
```
Input: 4,429 + 4,631 = 9,060 token
Output (max_tokens): 32,768 token (sınırlandırıldı)
Toplam: 41,828 token < 163,840 (GÜVENLİ)
```

---

## 🎯 Etkilenen Metodlar

1. **`createMessage`** (Streaming): ✅ Düzeltildi
2. **`completePrompt`** (Non-streaming): ✅ Düzeltildi

---

## 🔧 Sonraki Adımlar

1. **Extension'ı Rebuild Et**:
   ```bash
   cd C:\wamp64\www\RooForkVs\src
   pnpm bundle
   ```

2. **VSIX Oluştur**:
   ```bash
   pnpm vsix
   ```

3. **Test Et**:
   - DeepSeek V3.2 ile büyük bir istek yap
   - Artık context length hatası olmamalı

---

## 📝 Notlar

- DeepSeek V3.2'nin gerçek context limit'i: **163840 token**
- Model info'da contextWindow: 200000 (yanlış, düzeltilmeli)
- Güvenli max_tokens: **32768 token** (%20 kuralı)
- Input için yeterli alan: **131072 token** (%80)

---

## ✅ Düzeltme Durumu

- ✅ Streaming handler düzeltildi
- ✅ Non-streaming handler düzeltildi
- ✅ Lint hataları kontrol edildi (hata yok)
- ⏳ Extension rebuild edilmeli
- ⏳ VSIX oluşturulmalı

**Dosya**: `C:\wamp64\www\RooForkVs\src\api\providers\lite-llm.ts`

