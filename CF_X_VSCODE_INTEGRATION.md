# CF-X Model VSCode Extension Entegrasyonu

## Soru: Roo Code'da CF-X seçildiğinde 3 katmanlı çalışacak mı?

### Şu Anki Durum ❌

**Hayır, şu anda tam 3 katmanlı çalışmıyor.**

VSCode extension (Roo Code) CF-X seçildiğinde:
- Extension direkt LiteLLM'e `/chat/completions` isteği gönderir
- LiteLLM `cf-x` modelini görür ve DeepSeek V3.2'ye proxy eder
- **Sadece DeepSeek V3.2 çalışır** (Plan katmanı)
- Code ve Review katmanları çalışmaz

### Çözüm ✅

Orchestrator'a **HTTP API** eklendi. Artık CF-X tam 3 katmanlı çalışacak!

## Yapılan Değişiklikler

### 1. Orchestrator HTTP API Server
- `apps/orchestrator/src/server.ts` oluşturuldu
- Express.js ile HTTP API server
- Endpoint: `POST /cf-x` (3 katmanlı workflow)

### 2. Docker Compose Güncellendi
- Orchestrator artık HTTP API server olarak çalışıyor
- Port: `3000` (configurable)
- Long-running service olarak çalışıyor

### 3. Dashboard API Güncellendi
- Dashboard'dan CF-X seçildiğinde direkt 3 katmanlı workflow çalışıyor
- Her katman kendi modelini kullanıyor

## VSCode Extension için Çözüm

### Seçenek 1: Orchestrator HTTP API (Önerilen) ✅

VSCode extension'dan CF-X seçildiğinde:

```javascript
// Extension kodunda
const response = await fetch('http://orchestrator:3000/cf-x', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ task: userInput }),
});

const result = await response.json();
// result.formatted içinde 3 katmanlı sonuç var
```

**Avantajlar:**
- ✅ Tam 3 katmanlı workflow
- ✅ Her katman kendi modelini kullanır
- ✅ Orchestrator merkezi yönetim

### Seçenek 2: Extension'da 3 Ayrı İstek

VSCode extension kodu özelleştirilebilirse:

```javascript
// Extension'da 3 ayrı istek
const plan = await callLiteLLM('openrouter/deepseek/deepseek-v3.2', task);
const code = await callLiteLLM('openrouter/minimax/minimax-m2.1', task, plan);
const review = await callLiteLLM('openrouter/google/gemini-2.5-flash', task, plan, code);
```

**Avantajlar:**
- ✅ Extension'da tam kontrol
- ✅ Orchestrator'a bağımlı değil

**Dezavantajlar:**
- ❌ Extension kodunu değiştirmek gerekir
- ❌ Extension güncellemelerinde kaybolabilir

## Orchestrator HTTP API Endpoints

### CF-X Endpoint

```bash
POST http://orchestrator:3000/cf-x
Content-Type: application/json

{
  "task": "Create a REST API endpoint for user registration"
}
```

**Response:**
```json
{
  "success": true,
  "model": "cf-x",
  "result": {
    "plan": "...",
    "code": "...",
    "review": "..."
  },
  "formatted": "🚀 CF-X 3 Katmanlı Model Sonuçları\n\n..."
}
```

### Standard Workflow Endpoint

```bash
POST http://orchestrator:3000/run
Content-Type: application/json

{
  "task": "Your task",
  "cfX": false  // or true for CF-X
}
```

## Deployment

### Easypanel'de

1. Orchestrator servisini bul
2. Port mapping: `3000:3000`
3. Environment variable: `ORCHESTRATOR_MODE=api`
4. Rebuild et

### Docker Compose'da

```bash
docker-compose up -d orchestrator
```

Orchestrator HTTP API olarak çalışacak.

## VSCode Extension Entegrasyonu

VSCode extension'ın CF-X'i tam 3 katmanlı kullanması için:

1. **Orchestrator HTTP API'yi kullan** (Önerilen)
   - Extension'dan `http://orchestrator:3000/cf-x` endpoint'ini çağır
   - 3 katmanlı sonuç al

2. **Veya Extension'ı özelleştir**
   - Extension kodunda 3 ayrı model çağrısı yap
   - Her katman için ayrı istek gönder

## Sonuç

- ✅ **Dashboard'dan**: CF-X tam 3 katmanlı çalışıyor
- ⚠️ **VSCode Extension'dan**: Şu anda sadece DeepSeek V3.2 çalışıyor
- ✅ **Çözüm**: Orchestrator HTTP API eklendi, extension entegre edilebilir

VSCode extension'ı orchestrator HTTP API'sini kullanacak şekilde güncellenirse, CF-X tam 3 katmanlı çalışacak!

