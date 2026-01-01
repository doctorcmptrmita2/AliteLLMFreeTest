# Easypanel Deployment Plan - Laravel SaaS

## 🎯 Genel Bakış

Bu doküman, `A1laravelSaasPro` Laravel SaaS projesinin Easypanel'de nasıl deploy edileceğini adım adım açıklar.

---

## 📋 Ön Hazırlık

### 1. Proje Hazırlığı
- ✅ Laravel projesi oluşturuldu
- ✅ Database migrations hazır
- ✅ Dockerfile hazır
- ✅ .env.example hazır
- ✅ Git repository'ye push edildi

### 2. Easypanel'de Gerekli Bilgiler
- GitHub repository URL
- Branch name (genellikle `main` veya `master`)
- Domain/subdomain (opsiyonel)

---

## 🗄️ Veritabanı: PostgreSQL

### Neden PostgreSQL?
- ✅ Mevcut LiteLLM sistemi PostgreSQL kullanıyor
- ✅ Laravel'in tam desteği
- ✅ JSON field desteği (metadata için)
- ✅ Production-ready ve ölçeklenebilir
- ✅ Advanced indexing

**Karar: PostgreSQL kullanılacak** ✅

---

## 🚀 Easypanel'de Proje Oluşturma

### Adım 1: Yeni Proje Oluştur

1. Easypanel dashboard'a giriş yap
2. **"New Project"** butonuna tıkla
3. Proje adı: `codexflow-saas` (veya istediğin isim)
4. **"Create Project"** tıkla

---

### Adım 2: PostgreSQL Servisi Ekle

1. Proje içinde **"Add Service"** tıkla
2. **"PostgreSQL"** seç
3. Ayarlar:
   - **Service Name**: `postgres`
   - **Version**: `16` (veya `15`)
   - **Database Name**: `codexflow_saas`
   - **Username**: `codexflow`
   - **Password**: Güçlü bir şifre oluştur (kaydet!)
   - **Volume**: `postgres_data` (persistent storage)

4. **"Create"** tıkla

**Önemli**: Connection bilgilerini not al:
```
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=codexflow_saas
DB_USERNAME=codexflow
DB_PASSWORD=... (yukarıda oluşturduğun)
```

---

### Adım 3: Redis Servisi Ekle

1. **"Add Service"** tıkla
2. **"Redis"** seç
3. Ayarlar:
   - **Service Name**: `redis`
   - **Version**: `7` (veya `7-alpine`)
   - **Volume**: `redis_data` (persistent storage)

4. **"Create"** tıkla

**Connection bilgileri**:
```
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=null (genellikle)
```

---

### Adım 4: Laravel App Servisi Ekle

1. **"Add Service"** tıkla
2. **"App"** veya **"Custom"** seç
3. Ayarlar:

#### Source (Git)
- **Repository**: `https://github.com/your-username/A1laravelSaasPro.git`
- **Branch**: `main` (veya `master`)
- **Build Command**: (boş bırak, Dockerfile kullanılacak)

#### Dockerfile
- **Dockerfile Path**: `./Dockerfile` (root'ta olacak)
- **Context**: `.` (root)

#### Ports
- **Port**: `8000` (Laravel default)
- **Protocol**: `HTTP`

#### Volumes
- `storage` → `/var/www/html/storage` (Laravel storage)
- `bootstrap/cache` → `/var/www/html/bootstrap/cache` (cache)

#### Environment Variables
Aşağıdaki environment variable'ları ekle (Adım 5'te detaylı):

```env
APP_NAME=CodexFlow SaaS
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.easypanel.host

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=codexflow_saas
DB_USERNAME=codexflow
DB_PASSWORD=... (Adım 2'den)

REDIS_HOST=redis
REDIS_PORT=6379

LITELLM_BASE_URL=https://roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/v1
LITELLM_MASTER_KEY=sk-litellm-master-key-2025-roo-code-orchestrator
```

4. **"Create"** tıkla

---

### Adım 5: Environment Variables Detaylı

Laravel servisinde şu environment variable'ları ekle:

#### App Configuration
```env
APP_NAME="CodexFlow SaaS"
APP_ENV=production
APP_KEY=base64:... (ilk deploy'dan sonra oluşturulacak)
APP_DEBUG=false
APP_URL=https://your-domain.easypanel.host
```

#### Database (PostgreSQL)
```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=codexflow_saas
DB_USERNAME=codexflow
DB_PASSWORD=your_secure_password_from_step_2
```

#### Redis
```env
REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

#### LiteLLM Connection
```env
LITELLM_BASE_URL=https://roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/v1
LITELLM_MASTER_KEY=sk-litellm-master-key-2025-roo-code-orchestrator
```

#### Mail (SMTP - Mailtrap veya SendGrid)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@codexflow.com
MAIL_FROM_NAME="CodexFlow SaaS"
```

#### Stripe (Payment - Production'da ekle)
```env
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Session & Security
```env
SESSION_LIFETIME=120
SANCTUM_STATEFUL_DOMAINS=your-domain.easypanel.host
```

---

## 🐳 Dockerfile Yapısı

Laravel projesi için Dockerfile şu şekilde olacak:

```dockerfile
FROM php:8.2-fpm-alpine

# System dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev

# PHP extensions
RUN docker-php-ext-install pdo_pgsql pdo_mysql mbstring exif pcntl bcmath gd zip

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Working directory
WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8000

# Start command
CMD php artisan serve --host=0.0.0.0 --port=8000
```

**Not**: Production'da Nginx + PHP-FPM kullanılabilir, ama başlangıç için `php artisan serve` yeterli.

---

## 📝 İlk Deploy Sonrası Yapılacaklar

### 1. APP_KEY Oluştur

Laravel servisinde terminal aç:
```bash
php artisan key:generate
```

Çıkan key'i environment variable'a ekle:
```env
APP_KEY=base64:... (çıkan key)
```

### 2. Database Migration

```bash
php artisan migrate --force
```

### 3. Storage Link

```bash
php artisan storage:link
```

### 4. Cache Clear

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 5. Queue Worker (Opsiyonel)

Queue kullanıyorsan, ayrı bir worker servisi ekle veya cron job olarak çalıştır:
```bash
php artisan queue:work --tries=3
```

---

## 🔧 Easypanel Servis Yapılandırması

### Laravel App Servisi

#### Build Settings
- **Dockerfile**: `./Dockerfile`
- **Context**: `.`
- **Build Args**: (boş)

#### Runtime Settings
- **Command**: `php artisan serve --host=0.0.0.0 --port=8000`
- **Port**: `8000`
- **Health Check**: `/health` endpoint (oluşturulacak)

#### Volumes
- `storage` → `/var/www/html/storage`
- `bootstrap/cache` → `/var/www/html/bootstrap/cache`

#### Environment Variables
Yukarıdaki tüm environment variable'ları ekle.

---

## 🌐 Domain Yapılandırması

### Custom Domain (Opsiyonel)

1. Easypanel'de Laravel servisine git
2. **"Domains"** sekmesine tıkla
3. Custom domain ekle: `saas.yourdomain.com`
4. DNS ayarlarını yap:
   - A record: `@` → Easypanel IP
   - CNAME: `saas` → Easypanel domain

### Easypanel Subdomain (Otomatik)

Easypanel otomatik olarak subdomain verir:
`codexflow-saas.yourproject.easypanel.host`

---

## 🔄 Deployment Workflow

### 1. Kod Değişikliği
```bash
git add .
git commit -m "Update feature"
git push origin main
```

### 2. Easypanel Auto-Deploy
- Easypanel otomatik olarak build başlatır
- Build tamamlanınca deploy eder

### 3. Manual Deploy
- Easypanel dashboard'da **"Redeploy"** butonuna tıkla

---

## 📊 Monitoring & Logs

### Logs Görüntüleme

Easypanel'de her servis için:
1. Servise tıkla
2. **"Logs"** sekmesine git
3. Real-time logları görüntüle

### Health Check

Laravel'de health check endpoint'i oluştur:
```php
// routes/web.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'redis' => Redis::ping() ? 'connected' : 'disconnected',
    ]);
});
```

---

## 🔐 Güvenlik Checklist

- [ ] `APP_DEBUG=false` (production)
- [ ] `APP_KEY` oluşturuldu
- [ ] Database password güçlü
- [ ] Redis password (opsiyonel ama önerilir)
- [ ] HTTPS aktif (Easypanel otomatik)
- [ ] Environment variable'lar güvenli
- [ ] `.env` dosyası git'e eklenmedi
- [ ] Storage permissions doğru

---

## 🚨 Troubleshooting

### Database Connection Error
- PostgreSQL servisinin çalıştığını kontrol et
- Environment variable'ları kontrol et
- Network ayarlarını kontrol et (aynı network'te olmalı)

### Redis Connection Error
- Redis servisinin çalıştığını kontrol et
- `REDIS_HOST=redis` doğru mu?

### APP_KEY Error
- `php artisan key:generate` çalıştır
- Environment variable'a ekle

### Permission Errors
- Storage klasörü permissions: `chmod -R 755 storage`
- Cache klasörü permissions: `chmod -R 755 bootstrap/cache`

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] Git repository'ye push edildi
- [ ] Dockerfile hazır
- [ ] .env.example hazır
- [ ] Database migrations hazır

### Easypanel Setup
- [ ] Proje oluşturuldu
- [ ] PostgreSQL servisi eklendi
- [ ] Redis servisi eklendi
- [ ] Laravel app servisi eklendi
- [ ] Environment variable'lar eklendi

### Post-Deployment
- [ ] APP_KEY oluşturuldu
- [ ] Database migration çalıştırıldı
- [ ] Storage link oluşturuldu
- [ ] Cache temizlendi
- [ ] Health check çalışıyor
- [ ] Logs kontrol edildi

---

## 📚 Ek Kaynaklar

- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Easypanel Documentation](https://easypanel.io/docs)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)

---

Bu plan ile Easypanel'de sorunsuz bir deployment yapabilirsiniz! 🚀

