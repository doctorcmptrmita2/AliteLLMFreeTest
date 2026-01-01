# Roo Code (VSCode Extension) - CF-X Model Kullanımı

## ⚠️ Önemli Not

**Şu anda Roo Code'da CF-X seçildiğinde sadece DeepSeek V3.2 çalışıyor (Plan katmanı).**

Tam 3 katmanlı workflow için orchestrator HTTP API'si eklendi, ancak VSCode extension'ın bu API'yi kullanması gerekiyor.

## Mevcut Durum

### Roo Code'da CF-X Seçildiğinde:
- ✅ Model listesinde görünüyor (`cf-x`)
- ❌ Sadece DeepSeek V3.2 çalışıyor (fallback model)
- ❌ Code ve Review katmanları çalışmıyor

### Neden?
- VSCode extension direkt LiteLLM'e istek gönderiyor
- LiteLLM'de `cf-x` sadece DeepSeek V3.2'ye proxy ediyor
- 3 katmanlı workflow orchestrator'da

## Çözüm: Orchestrator HTTP API

Orchestrator'a HTTP API eklendi:

### Endpoint
```
POST http://orchestrator:3000/cf-x
```

### Kullanım
```bash
curl -X POST http://orchestrator:3000/cf-x \
  -H "Content-Type: application/json" \
  -d '{"task": "Create a REST API endpoint"}'
```

### Response
```json
{
  "success": true,
  "model": "cf-x",
  "result": {
    "plan": "Plan (DeepSeek V3.2)",
    "code": "Code (MiniMax M2.1)",
    "review": "Review (Gemini 2.5 Flash)"
  },
  "formatted": "Formatted output..."
}
```

## VSCode Extension Entegrasyonu

VSCode extension'ın CF-X'i tam 3 katmanlı kullanması için:

### Seçenek 1: Orchestrator API Kullan (Önerilen)

Extension kodunda:
```typescript
// CF-X için orchestrator API'yi kullan
if (selectedModel === 'cf-x') {
  const response = await fetch('http://orchestrator:3000/cf-x', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task: userInput }),
  });
  
  const result = await response.json();
  return result.formatted; // 3 katmanlı sonuç
}
```

### Seçenek 2: Extension'da 3 Ayrı İstek

Extension kodunda 3 ayrı model çağrısı:
```typescript
// Plan
const plan = await callLiteLLM('openrouter/deepseek/deepseek-v3.2', task);

// Code
const code = await callLiteLLM('openrouter/minimax/minimax-m2.1', task, plan);

// Review
const review = await callLiteLLM('openrouter/google/gemini-2.5-flash', task, plan, code);
```

## Şu Anki Çalışma Durumu

| Platform | CF-X Durumu | 3 Katmanlı? |
|----------|-------------|-------------|
| **Dashboard** | ✅ Çalışıyor | ✅ Evet (tam 3 katmanlı) |
| **CLI** | ✅ Çalışıyor | ✅ Evet (tam 3 katmanlı) |
| **VSCode Extension** | ⚠️ Kısmen | ❌ Hayır (sadece Plan) |

## Sonuç

- ✅ **Dashboard'dan**: CF-X tam 3 katmanlı çalışıyor
- ✅ **CLI'den**: CF-X tam 3 katmanlı çalışıyor
- ⚠️ **VSCode Extension'dan**: Şu anda sadece Plan katmanı çalışıyor

VSCode extension orchestrator HTTP API'sini kullanacak şekilde güncellenirse, CF-X tam 3 katmanlı çalışacak!


