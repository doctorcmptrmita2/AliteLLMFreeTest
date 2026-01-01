# Laravel SaaS - LiteLLM Entegrasyon Detayları

## 🔗 İki Proje Arasındaki Bağlantı

### Proje 1: AliteLLMFreeTest (Mevcut)
- **Konum**: `C:\wamp64\www\AliteLLMFreeTest`
- **Rol**: LiteLLM Proxy Server
- **API**: Admin API endpoints
- **Database**: PostgreSQL (LiteLLM logs)

### Proje 2: A1laravelSaasPro (Yeni)
- **Konum**: `C:\wamp64\www\A1laravelSaasPro`
- **Rol**: SaaS Platform (Müşteri Yönetimi)
- **Bağlantı**: LiteLLM'e REST API ile bağlanır
- **Database**: PostgreSQL (SaaS data)

---

## 📡 API Entegrasyon Detayları

### LiteLLM Admin API Endpoints

#### 1. Logs Endpoint
```
GET {LITELLM_BASE_URL}/v1/logs
Headers:
  Authorization: Bearer {MASTER_KEY}
Query Parameters:
  - start_date: YYYY-MM-DD
  - end_date: YYYY-MM-DD
  - limit: 100-10000
  - api_key: (opsiyonel, filtreleme için)

Response:
[
  {
    "id": "log_123",
    "created_at": "2025-12-30T10:00:00Z",
    "model": "gpt-4o-mini",
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_tokens": 150,
    "spend": 0.001,
    "response_time": 1.5,
    "status_code": 200,
    "user_api_key": "sk-xxx",
    "path": "/v1/chat/completions"
  }
]
```

#### 2. Usage Endpoint
```
GET {LITELLM_BASE_URL}/v1/usage/global
Headers:
  Authorization: Bearer {MASTER_KEY}
Query Parameters:
  - start_date: YYYY-MM-DD
  - end_date: YYYY-MM-DD
  - api_key: (opsiyonel)

Response:
{
  "total_requests": 1000,
  "total_tokens": 150000,
  "requests": 1000,
  "tokens": 150000
}
```

#### 3. Spend/Cost Endpoint
```
GET {LITELLM_BASE_URL}/v1/usage/spend
Headers:
  Authorization: Bearer {MASTER_KEY}
Query Parameters:
  - start_date: YYYY-MM-DD
  - end_date: YYYY-MM-DD
  - api_key: (opsiyonel)

Response:
{
  "total_spend": 10.50,
  "spend": 10.50,
  "cost": 10.50
}
```

#### 4. API Keys List
```
GET {LITELLM_BASE_URL}/v1/key/list
Headers:
  Authorization: Bearer {MASTER_KEY}

Response:
[
  {
    "key_id": "sk-xxx",
    "token": "sk-xxx",
    "metadata": {
      "user_id": "user_123",
      "user_email": "user@example.com"
    },
    "created_at": "2025-12-01T00:00:00Z"
  }
]
```

---

## 🔄 Veri Senkronizasyon Senaryoları

### Senaryo 1: İlk Kurulum (Bulk Import)

```
1. Laravel SaaS kuruldu
2. LiteLLM'den tüm geçmiş logları çek (son 30 gün)
3. Her log için:
   - API key'i bul
   - Tenant'ı bul (API key mapping'den)
   - UsageLog kaydı oluştur
4. Toplu insert (batch processing)
```

### Senaryo 2: Periyodik Sync (Her 5 Dakika)

```
1. Scheduled job çalışır
2. Son sync zamanını kontrol et
3. O zamandan sonraki logları çek
4. Sadece yeni logları ekle (duplicate kontrolü)
5. Sync log kaydet
```

### Senaryo 3: Real-time Proxy (Müşteri İsteği)

```
1. Müşteri Laravel API'ye istek atar
2. Laravel: API key doğrula
3. Laravel: İsteği LiteLLM'e proxy et
4. LiteLLM response döner
5. Laravel: Response'u müşteriye döndür
6. Laravel: Usage log kaydet (hemen)
```

---

## 🗄️ Veri Mapping Tablosu

| LiteLLM Field | Laravel Field | Açıklama |
|--------------|---------------|----------|
| `user_api_key` | `api_key_id` | API key mapping |
| `created_at` | `created_at` | Timestamp |
| `model` | `metadata->model` | Model bilgisi |
| `total_tokens` | `tokens_used` | Token sayısı |
| `spend` | `cost` | Maliyet |
| `response_time` | `response_time` | Response süresi |
| `status_code` | `status_code` | HTTP status |
| `path` | `endpoint` | Endpoint path |

---

## 🔐 Güvenlik & Authentication

### Master Key Kullanımı
- Laravel SaaS, LiteLLM Admin API'ye master key ile bağlanır
- Master key environment variable'da saklanır
- Her request'te Authorization header'da gönderilir

### API Key Mapping
- Laravel'deki API key'ler LiteLLM'deki key'lerle eşleştirilir
- Mapping tablosu: `api_keys.litellm_key_id`
- Sync sırasında bu mapping kullanılır

---

## 📊 Veri Akış Diyagramı

```
┌─────────────────┐
│  Customer       │
│  (API Request)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Laravel SaaS   │
│  - Auth Check   │
│  - Rate Limit   │
│  - Usage Track  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  LiteLLM Proxy  │
│  - Process      │
│  - Log          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Provider    │
│  (OpenRouter)   │
└─────────────────┘

         │
         ▼
┌─────────────────┐
│  Sync Job       │
│  (Every 5 min)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Laravel DB     │
│  - UsageLogs    │
│  - Analytics    │
└─────────────────┘
```

---

## 🎯 Entegrasyon Öncelikleri

### Yüksek Öncelik
1. ✅ LiteLLM API client oluştur
2. ✅ Veri sync job'ları
3. ✅ Proxy endpoint'leri
4. ✅ API key mapping

### Orta Öncelik
5. ⚠️ Error handling & retry
6. ⚠️ Performance optimization
7. ⚠️ Caching strategy

### Düşük Öncelik
8. ⚪ Webhook support (gelecekte)
9. ⚪ Real-time updates
10. ⚪ Advanced filtering

---

Bu plan ile iki proje arasında sağlam bir entegrasyon kurabilirsiniz! 🚀

