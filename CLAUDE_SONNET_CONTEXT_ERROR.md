# Claude Sonnet 4.5 Context Length Hatası Analizi

## 🔴 Hata Mesajı

```
400 BadRequestError: This endpoint's maximum context length is 1000000 tokens. 
However, you requested about 1007978 tokens 
(4502 of text input, 3476 of tool input, 1000000 in the output).
```

**Model**: `openrouter/anthropic/claude-sonnet-4.5`  
**Tarih**: 2026-01-01 17:01:35

---

## 🔍 Sorun Analizi

### Detaylar

| Öğe | Token Sayısı |
|-----|--------------|
| Text Input | 4,502 |
| Tool Input | 3,476 |
| Output (max_tokens) | **1,000,000** ❌ |
| **Toplam** | **1,007,978** |
| **Limit** | **1,000,000** |

### Sorun

- **max_tokens**: 1,000,000 token (çok yüksek!)
- **Context limit**: 1,000,000 token (toplam: input + output)
- **Sonuç**: Limit aşıldı (1,007,978 > 1,000,000)

### Neden Oluşuyor?

CodexFlow extension'ında Claude Sonnet 4.5 için `maxTokens` çok yüksek ayarlanmış veya model info'dan yanlış değer geliyor.

---

## ✅ Çözüm

DeepSeek V3.2 için yaptığımız gibi, Claude Sonnet 4.5 için de `max_tokens`'ı sınırlandırmalıyız.

### Kural

- **max_tokens**: Context window'un %20'si (200,000 token)
- **Input için**: %80 (800,000 token) bırakılır
- **Güvenli**: Input + Output toplamı context limit'i aşmaz

---

## 📊 Örnek Hesaplama

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

---

## 🛠️ Yapılacak Düzeltme

CodexFlow extension'ında Claude Sonnet 4.5 için de max_tokens sınırlaması eklenmeli.

