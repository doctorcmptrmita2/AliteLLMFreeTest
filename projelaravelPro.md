# Laravel SaaS Projesi - Profesyonel Planlama

## 🎯 Proje Genel Bakış

### Proje Adı: CodexFlow SaaS Platform
**Konum**: `C:\wamp64\www\A1laravelSaasPro`

### Amaç
Laravel tabanlı SaaS platformu ile LiteLLM proxy sistemini yönetmek, müşterilere hizmet sunmak ve tüm işlemleri (log, maliyet, kullanım) takip etmek.

---

## 🔗 Sistem Mimarisi

### İki Proje Entegrasyonu

```
┌─────────────────────────────────┐
│   Laravel SaaS Platform         │
│   (A1laravelSaasPro)            │
│                                 │
│   - Multi-tenant yönetim        │
│   - Subscription & Billing      │
│   - Customer Dashboard          │
│   - Analytics & Reporting       │
└──────────────┬──────────────────┘
               │
               │ REST API
               │ (HTTP/HTTPS)
               │
               ▼
┌─────────────────────────────────┐
│   LiteLLM Proxy System          │
│   (AliteLLMFreeTest)            │
│                                 │
│   - LiteLLM Proxy               │
│   - PostgreSQL Database         │
│   - Admin API                   │
│   - Request Logging             │
└─────────────────────────────────┘
```

---

## 📊 Veri Akışı

### 1. Müşteri → Laravel SaaS → LiteLLM

```
Customer Request
    ↓
Laravel SaaS (API Gateway)
    ↓
LiteLLM Proxy
    ↓
AI Provider (OpenRouter)
```

### 2. LiteLLM → Laravel SaaS (Veri Çekme)

```
LiteLLM Admin API
    ↓
Laravel SaaS (Scheduled Jobs)
    ↓
PostgreSQL Database (Laravel)
    ↓
Customer Dashboard
```

---

## 🏗️ Laravel SaaS Proje Yapısı

### Klasör Yapısı

```
A1laravelSaasPro/
├── app/
│   ├── Models/
│   │   ├── Tenant.php              # Müşteri/Şirket
│   │   ├── User.php                # Kullanıcılar
│   │   ├── Subscription.php        # Abonelikler
│   │   ├── ApiKey.php              # API Key'ler
│   │   ├── UsageLog.php            # Kullanım logları
│   │   ├── BillingRecord.php       # Faturalama kayıtları
│   │   └── LiteLLMSync.php         # LiteLLM senkronizasyon
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── ProxyController.php      # LiteLLM'e proxy
│   │   │   │   └── ChatController.php        # Chat completions
│   │   │   ├── Dashboard/
│   │   │   │   ├── DashboardController.php  # Ana dashboard
│   │   │   │   ├── AnalyticsController.php  # Analitik
│   │   │   │   └── ReportsController.php    # Raporlar
│   │   │   ├── Subscription/
│   │   │   │   ├── SubscriptionController.php
│   │   │   │   └── BillingController.php
│   │   │   └── Admin/
│   │   │       └── LiteLLMSyncController.php
│   │   │
│   │   ├── Middleware/
│   │   │   ├── IdentifyTenant.php           # Tenant belirleme
│   │   │   ├── EnsureSubscription.php      # Abonelik kontrolü
│   │   │   ├── RateLimitByPlan.php          # Plan limitleri
│   │   │   └── TrackUsage.php               # Kullanım takibi
│   │   │
│   │   └── Requests/
│   │       ├── CreateApiKeyRequest.php
│   │       └── UpdateSubscriptionRequest.php
│   │
│   ├── Services/
│   │   ├── LiteLLM/
│   │   │   ├── LiteLLMClient.php            # LiteLLM API client
│   │   │   ├── LiteLLMSyncService.php       # Veri senkronizasyonu
│   │   │   └── LiteLLMProxyService.php       # Proxy işlemleri
│   │   ├── Billing/
│   │   │   ├── BillingService.php            # Faturalama
│   │   │   ├── CostCalculator.php           # Maliyet hesaplama
│   │   │   └── InvoiceGenerator.php         # Fatura oluşturma
│   │   ├── Subscription/
│   │   │   ├── SubscriptionService.php      # Abonelik yönetimi
│   │   │   └── PlanLimitsService.php        # Plan limitleri
│   │   └── Analytics/
│   │       ├── UsageAnalytics.php           # Kullanım analitiği
│   │       └── CostAnalytics.php            # Maliyet analitiği
│   │
│   ├── Jobs/
│   │   ├── SyncLiteLLMLogs.php              # Log senkronizasyonu
│   │   ├── SyncLiteLLMUsage.php             # Usage senkronizasyonu
│   │   ├── SyncLiteLLMCosts.php             # Cost senkronizasyonu
│   │   ├── CalculateMonthlyBilling.php      # Aylık faturalama
│   │   └── SendUsageReports.php             # Kullanım raporları
│   │
│   └── Console/
│       └── Commands/
│           ├── SyncLiteLLMData.php          # Manuel sync komutu
│           └── GenerateInvoices.php          # Fatura oluşturma
│
├── database/
│   ├── migrations/
│   │   ├── create_tenants_table.php
│   │   ├── create_subscriptions_table.php
│   │   ├── create_api_keys_table.php
│   │   ├── create_usage_logs_table.php
│   │   ├── create_billing_records_table.php
│   │   └── create_litellm_sync_logs_table.php
│   │
│   └── seeders/
│       ├── TenantSeeder.php
│       └── SubscriptionPlanSeeder.php
│
├── routes/
│   ├── web.php                              # Web routes (Dashboard)
│   ├── api.php                              # API routes (Customer API)
│   ├── proxy.php                            # Proxy routes (LiteLLM'e)
│   └── admin.php                            # Admin routes
│
├── resources/
│   ├── js/
│   │   ├── Pages/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Index.vue
│   │   │   │   ├── Analytics.vue
│   │   │   │   └── Reports.vue
│   │   │   ├── Subscription/
│   │   │   │   ├── Plans.vue
│   │   │   │   └── Billing.vue
│   │   │   └── ApiKeys/
│   │   │       └── Index.vue
│   │   └── Components/
│   │       ├── UsageChart.vue
│   │       ├── CostChart.vue
│   │       └── StatCard.vue
│   │
│   └── views/
│       └── emails/
│           ├── invoice.blade.php
│           └── usage-report.blade.php
│
└── config/
    ├── litellm.php                          # LiteLLM bağlantı ayarları
    ├── subscriptions.php                    # Plan tanımları
    └── billing.php                          # Faturalama ayarları
```

---

## 🔌 LiteLLM Entegrasyonu

### API Endpoints (LiteLLM'den Veri Çekme)

#### 1. Logs Endpoint
```
GET https://litellm-proxy/v1/logs
Headers: Authorization: Bearer {MASTER_KEY}
Query: start_date, end_date, limit, api_key
```

#### 2. Usage Endpoint
```
GET https://litellm-proxy/v1/usage/global
Headers: Authorization: Bearer {MASTER_KEY}
Query: start_date, end_date, api_key
```

#### 3. Spend/Cost Endpoint
```
GET https://litellm-proxy/v1/usage/spend
Headers: Authorization: Bearer {MASTER_KEY}
Query: start_date, end_date, api_key
```

#### 4. API Keys Endpoint
```
GET https://litellm-proxy/v1/key/list
Headers: Authorization: Bearer {MASTER_KEY}
```

#### 5. Key Info Endpoint
```
GET https://litellm-proxy/v1/key/info?key_id={key_id}
Headers: Authorization: Bearer {MASTER_KEY}
```

### Veri Senkronizasyon Stratejisi

#### Real-time Sync (Webhook - Gelecekte)
- LiteLLM'den webhook al
- Anlık veri güncellemesi

#### Scheduled Sync (Şimdilik)
- Her 5 dakikada bir: Logs sync
- Her 15 dakikada bir: Usage sync
- Her saatte bir: Cost sync
- Her gün: Monthly billing hesaplama

---

## 📋 Database Schema

### 1. Tenants Table
```sql
- id
- name (Şirket adı)
- slug (URL slug)
- domain (Custom domain)
- email
- settings (JSON: plan limits, features)
- trial_ends_at
- is_active
- created_at, updated_at
```

### 2. Subscriptions Table
```sql
- id
- tenant_id (FK)
- plan_id (free, starter, pro)
- stripe_subscription_id
- stripe_customer_id
- status (active, canceled, past_due)
- current_period_start
- current_period_end
- cancel_at_period_end
- canceled_at
- created_at, updated_at
```

### 3. ApiKeys Table
```sql
- id
- tenant_id (FK)
- litellm_key_id (LiteLLM'deki key ID)
- name
- key (Hashed)
- last_used_at
- is_active
- created_at, updated_at
```

### 4. UsageLogs Table
```sql
- id
- tenant_id (FK)
- api_key_id (FK)
- litellm_log_id (LiteLLM'deki log ID - sync için)
- endpoint
- method
- status_code
- response_time (ms)
- tokens_used
- cost
- metadata (JSON: model, user_id, etc.)
- created_at (LiteLLM'den gelen timestamp)
- synced_at (Laravel'de sync edilme zamanı)
```

### 5. BillingRecords Table
```sql
- id
- tenant_id (FK)
- subscription_id (FK)
- period_start
- period_end
- total_requests
- total_tokens
- total_cost
- stripe_invoice_id
- status (pending, paid, failed)
- created_at, updated_at
```

### 6. LiteLLMSyncLogs Table
```sql
- id
- sync_type (logs, usage, costs)
- status (success, failed)
- records_synced
- last_synced_id (LiteLLM'den son sync edilen ID)
- error_message
- started_at
- completed_at
```

---

## 🔄 İş Akışları

### 1. Yeni Müşteri Kaydı

```
1. Tenant oluştur (Laravel)
2. Subscription oluştur (Free plan)
3. LiteLLM'de API key oluştur
4. API key'i Laravel'e kaydet
5. Müşteriye dashboard erişimi ver
```

### 2. API İsteği (Müşteri → LiteLLM)

```
1. Müşteri Laravel API'ye istek atar
2. Laravel: API key doğrula
3. Laravel: Subscription kontrolü
4. Laravel: Rate limit kontrolü
5. Laravel: İsteği LiteLLM'e proxy et
6. Laravel: Response'u müşteriye döndür
7. Laravel: Usage log kaydet
8. Laravel: Cost hesapla
```

### 3. Veri Senkronizasyonu (LiteLLM → Laravel)

```
1. Scheduled Job çalışır (Her 5 dakika)
2. LiteLLM Admin API'den logs çek
3. Her log için:
   - Tenant'ı bul (API key'e göre)
   - UsageLog tablosuna kaydet
   - Duplicate kontrolü (litellm_log_id ile)
4. Sync log kaydet
```

### 4. Aylık Faturalama

```
1. Her ayın sonunda job çalışır
2. Her aktif subscription için:
   - O ayın usage'ını topla
   - Cost'u hesapla
   - BillingRecord oluştur
   - Stripe'da invoice oluştur
   - Email gönder
```

---

## 🎨 Frontend Dashboard Özellikleri

### Ana Dashboard
- **Overview Cards**:
  - Toplam API Calls (bugün/ay)
  - Toplam Cost (bugün/ay)
  - Active API Keys
  - Usage Percentage (plan limitine göre)

- **Charts**:
  - Daily Usage Chart (Son 30 gün)
  - Cost Trend Chart
  - Model Distribution (Hangi modeller kullanılmış)
  - Endpoint Distribution

- **Recent Activity**:
  - Son API istekleri
  - Hata logları
  - Önemli olaylar

### Analytics Sayfası
- **Time Range Selector**: Bugün, Bu Hafta, Bu Ay, Custom
- **Filters**: Model, Endpoint, Status Code
- **Metrics**:
  - Total Requests
  - Total Tokens
  - Average Response Time
  - Success Rate
  - Total Cost
  - Cost per Request
  - Cost per Token

### API Keys Yönetimi
- API key listesi
- Yeni key oluştur
- Key sil/deaktif et
- Key kullanım istatistikleri
- Key bazlı cost breakdown

### Subscription & Billing
- Mevcut plan gösterimi
- Plan upgrade/downgrade
- Kullanım limitleri (progress bar)
- Fatura geçmişi
- Ödeme yöntemleri

---

## 🔐 Güvenlik & Yetkilendirme

### Multi-Tenancy
- Her request'te tenant kontrolü
- Global scope ile otomatik filtreleme
- Tenant bazlı data isolation

### API Key Security
- API key'ler hash'lenmiş saklanır
- LiteLLM'deki key ID ile mapping
- Key rotation desteği

### Rate Limiting
- Plan bazlı rate limits
- Endpoint bazlı limits
- Token bazlı limits
- IP bazlı limits (opsiyonel)

---

## 📊 Raporlama & Analytics

### Müşteri Raporları
- **Daily Report**: Günlük özet email
- **Weekly Report**: Haftalık detaylı rapor
- **Monthly Invoice**: Aylık fatura + detaylı kullanım

### Admin Raporları
- Tüm tenant'ların toplam kullanımı
- Revenue raporları
- Churn analizi
- Growth metrics

---

## 🔧 Teknik Detaylar

### Laravel Paketleri
```
- laravel/breeze (Auth)
- laravel/sanctum (API Auth)
- spatie/laravel-permission (Roles)
- stripe/stripe-php (Payment)
- guzzlehttp/guzzle (HTTP Client - LiteLLM için)
- laravel/horizon (Queue Management)
- spatie/laravel-activitylog (Activity Logging)
- inertiajs/inertia-laravel (Frontend)
```

### Queue Jobs
```
- SyncLiteLLMLogs: Her 5 dakika
- SyncLiteLLMUsage: Her 15 dakika
- SyncLiteLLMCosts: Her saat
- CalculateMonthlyBilling: Her ay sonu
- SendUsageReports: Günlük/Haftalık
```

### Scheduled Commands
```php
// app/Console/Kernel.php
$schedule->job(new SyncLiteLLMLogs)->everyFiveMinutes();
$schedule->job(new SyncLiteLLMUsage)->everyFifteenMinutes();
$schedule->job(new SyncLiteLLMCosts)->hourly();
$schedule->command('billing:calculate-monthly')->monthly();
```

---

## 🌐 API Endpoints (Laravel SaaS)

### Customer API (Müşteri API'leri)

#### Proxy Endpoints
```
POST /api/v1/chat/completions
POST /api/v1/completions
POST /api/v1/embeddings
```
→ Bu endpoint'ler LiteLLM'e proxy edilir

#### Dashboard API
```
GET  /api/dashboard/stats
GET  /api/dashboard/usage
GET  /api/dashboard/analytics
GET  /api/api-keys
POST /api/api-keys
DELETE /api/api-keys/{id}
GET  /api/subscription
POST /api/subscription/upgrade
```

### Admin API (Sistem Yönetimi)
```
GET  /admin/tenants
POST /admin/tenants
GET  /admin/sync/litellm
POST /admin/sync/litellm/force
GET  /admin/analytics/global
```

---

## 💰 Fiyatlandırma Planları

### Free Plan
- 1,000 API calls/ay
- 1 API key
- 1 user
- Basic analytics
- Email support

### Starter Plan - $29/ay
- 10,000 API calls/ay
- 5 API keys
- 5 users
- Advanced analytics
- Priority support

### Pro Plan - $99/ay
- 100,000 API calls/ay
- 20 API keys
- 20 users
- Custom analytics
- Dedicated support
- Custom integrations

### Enterprise - Custom
- Unlimited API calls
- Unlimited API keys
- Unlimited users
- Custom features
- SLA guarantee
- Dedicated account manager

---

## 🔄 Veri Senkronizasyon Detayları

### Sync Stratejisi

#### 1. İlk Sync (Bulk Import)
- Tüm geçmiş logları çek
- Batch insert (1000'er 1000'er)
- Duplicate kontrolü

#### 2. Incremental Sync
- Son sync'ten sonraki logları çek
- `last_synced_id` ile takip
- Sadece yeni kayıtları ekle

#### 3. Error Handling
- Sync başarısız olursa retry
- Max 3 retry
- Hata loglama
- Admin'e bildirim

### Sync Performance
- Queue kullan (async)
- Batch processing
- Database indexing
- Cache kullan (tenant bilgileri)

---

## 📈 Ölçeklenebilirlik

### Database
- Indexing: tenant_id, api_key_id, created_at
- Partitioning: UsageLogs tablosu (aylık partition)
- Read Replicas (gelecekte)

### Caching
- Redis kullan
- Tenant bilgileri cache
- Plan limits cache
- Usage stats cache (5 dakika TTL)

### Queue
- Laravel Horizon
- Multiple workers
- Priority queues

---

## 🗄️ Veritabanı Seçimi

### ✅ PostgreSQL Kullanılacak

**Neden PostgreSQL?**
- ✅ Mevcut LiteLLM sistemi PostgreSQL kullanıyor (tutarlılık)
- ✅ Laravel'in tam desteği var
- ✅ JSON field desteği (metadata için ideal)
- ✅ Production-ready, güçlü ve ölçeklenebilir
- ✅ Advanced indexing ve query optimizasyonu
- ✅ Multi-tenancy için uygun

**Alternatif: MySQL/MariaDB**
- Laravel MySQL'i de destekler
- Ama PostgreSQL daha güçlü özelliklere sahip
- JSON field desteği daha iyi

**Karar: PostgreSQL** ✅

---

## 🚀 Deployment Stratejisi

### Easypanel Yapılandırması

#### Servisler (Easypanel'de Oluşturulacak)
1. **Laravel App** (PHP 8.2+ FPM)
2. **PostgreSQL** (Database - ayrı servis)
3. **Redis** (Cache + Queue - ayrı servis)
4. **Nginx** (Web Server - Easypanel otomatik ekler)

#### Environment Variables (Easypanel'de Ayarlanacak)
```env
# App Configuration
APP_NAME="CodexFlow SaaS"
APP_ENV=production
APP_KEY=base64:... (php artisan key:generate ile oluştur)
APP_DEBUG=false
APP_URL=https://your-domain.easypanel.host

# Database (PostgreSQL)
DB_CONNECTION=pgsql
DB_HOST=postgres (Easypanel servis adı)
DB_PORT=5432
DB_DATABASE=codexflow_saas
DB_USERNAME=codexflow
DB_PASSWORD=secure_password_here

# LiteLLM Connection
LITELLM_BASE_URL=https://roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/v1
LITELLM_MASTER_KEY=sk-litellm-master-key-2025-roo-code-orchestrator

# Redis (Cache + Queue)
REDIS_HOST=redis (Easypanel servis adı)
REDIS_PASSWORD=null
REDIS_PORT=6379
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Mail Configuration (SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@codexflow.com
MAIL_FROM_NAME="${APP_NAME}"

# Stripe (Payment)
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Session & Security
SESSION_LIFETIME=120
SANCTUM_STATEFUL_DOMAINS=your-domain.easypanel.host
```

**Detaylı deployment planı için**: `EASYPANEL_DEPLOYMENT_PLAN.md` dosyasına bakın.

---

## 📝 Geliştirme Aşamaları

### Faz 1: Temel Altyapı (1-2 hafta)
- ✅ Laravel projesi kurulumu
- ✅ Database schema
- ✅ Multi-tenancy
- ✅ Basic auth

### Faz 2: LiteLLM Entegrasyonu (1 hafta)
- ✅ LiteLLM API client
- ✅ Veri senkronizasyonu
- ✅ Proxy endpoint'leri

### Faz 3: Subscription & Billing (1 hafta)
- ✅ Plan yönetimi
- ✅ Stripe entegrasyonu
- ✅ Faturalama

### Faz 4: Dashboard & Analytics (1-2 hafta)
- ✅ Frontend (Inertia + Vue)
- ✅ Charts & graphs
- ✅ Reports

### Faz 5: Production Ready (1 hafta)
- ✅ Testing
- ✅ Performance optimization
- ✅ Security audit
- ✅ Documentation

---

## 🎯 Başarı Kriterleri

### Fonksiyonel
- ✅ Müşteriler kayıt olabilmeli
- ✅ API key oluşturabilmeli
- ✅ LiteLLM'e istek atabilmeli
- ✅ Kullanım verilerini görebilmeli
- ✅ Faturalama çalışmalı

### Performans
- ✅ API response time < 200ms
- ✅ Sync job'ları 5 dakikada tamamlanmalı
- ✅ Dashboard yükleme < 2 saniye

### Güvenlik
- ✅ Multi-tenancy isolation
- ✅ API key security
- ✅ Rate limiting
- ✅ SQL injection koruması
- ✅ XSS koruması

---

## 📚 Dokümantasyon İhtiyaçları

1. **API Documentation** (Swagger/OpenAPI)
2. **Developer Guide** (Müşteriler için)
3. **Admin Guide** (Sistem yöneticileri için)
4. **Integration Guide** (LiteLLM entegrasyonu)

---

## 🔮 Gelecek Özellikler

### Kısa Vadeli
- Webhook desteği (LiteLLM'den)
- Real-time dashboard updates
- Custom domains per tenant
- API key rotation

### Orta Vadeli
- White-label solution
- Custom branding
- Advanced analytics
- Machine learning insights

### Uzun Vadeli
- Multi-region support
- Enterprise SSO
- Custom AI model training
- Marketplace (3rd party integrations)

---

## 📞 Entegrasyon Noktaları

### Mevcut Proje (AliteLLMFreeTest) ile Bağlantı

#### 1. LiteLLM Admin API
- Base URL: `https://roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host`
- Master Key: Environment variable'dan
- Endpoints: `/v1/logs`, `/v1/usage/global`, `/v1/key/list`

#### 2. Veri Çekme Yöntemi
- REST API calls (Guzzle HTTP Client)
- Scheduled jobs ile periyodik sync
- Error handling & retry logic

#### 3. Veri Mapping
- LiteLLM API key → Laravel Tenant
- LiteLLM logs → Laravel UsageLogs
- LiteLLM usage → Laravel Analytics
- LiteLLM costs → Laravel Billing

---

## ✅ Checklist

### Kurulum
- [ ] Laravel projesi oluştur
- [ ] Database schema oluştur
- [ ] LiteLLM API client yaz
- [ ] Multi-tenancy kur
- [ ] Auth sistemi

### Entegrasyon
- [ ] LiteLLM bağlantısı test et
- [ ] Veri sync job'ları yaz
- [ ] Proxy endpoint'leri oluştur
- [ ] Error handling ekle

### Frontend
- [ ] Dashboard sayfaları
- [ ] Charts & graphs
- [ ] API key yönetimi
- [ ] Subscription yönetimi

### Production
- [ ] Testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation

---

Bu plan ile profesyonel bir SaaS platformu oluşturabilirsiniz! 🚀

