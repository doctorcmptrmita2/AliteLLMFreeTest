# Easypanel'de Laravel SaaS Projesi - Adım Adım Rehber

## 📋 Ön Hazırlık

### 1. Git Repository Hazırla

```bash
# Yeni bir klasör oluştur
mkdir codexflow-saas
cd codexflow-saas

# Git initialize et
git init
git branch -M main
```

## 🚀 Adım 1: Laravel Projesi Oluştur

### Local'de Laravel Kurulumu

```bash
# Laravel'i composer ile kur
composer create-project laravel/laravel .

# Veya mevcut bir Laravel projesi varsa, sadece git'e ekle
```

### İlk Commit

```bash
git add .
git commit -m "Initial Laravel project"
```

## 🌐 Adım 2: GitHub Repository Oluştur

1. **GitHub'a git**: https://github.com/new
2. **Repository adı**: `codexflow-saas` (veya istediğiniz isim)
3. **Public veya Private** seçin
4. **"Create repository"** tıklayın
5. **GitHub'ın verdiği komutları çalıştır**:

```bash
git remote add origin https://github.com/KULLANICI_ADI/codexflow-saas.git
git push -u origin main
```

## 🎯 Adım 3: Easypanel'de Yeni Proje

### 3.1 Easypanel'e Giriş

1. **Easypanel Dashboard'a git**: https://easypanel.io
2. **Login** yap

### 3.2 Yeni Proje Oluştur

1. **"New Project"** veya **"Create Project"** butonuna tıkla
2. **Project Name**: `codexflow-saas` (veya istediğiniz isim)
3. **"Create"** tıkla

### 3.3 Git Repository Bağla

1. Proje sayfasında **"Source"** veya **"Git"** sekmesine git
2. **Repository URL**: GitHub repository URL'inizi yapıştırın
   ```
   https://github.com/KULLANICI_ADI/codexflow-saas.git
   ```
3. **Branch**: `main` (veya `master`)
4. **"Connect"** veya **"Save"** tıkla

## 🐳 Adım 4: Dockerfile Oluştur

Easypanel Laravel'i otomatik algılar, ama özelleştirmek için:

### Proje root'una `Dockerfile` ekle:

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
RUN docker-php-ext-install pdo pdo_pgsql pdo_mysql mbstring zip exif pcntl

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Node.js
RUN apk add --no-cache nodejs npm

WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev
RUN npm install && npm run build

# Permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
```

### `.dockerignore` dosyası:

```
node_modules
vendor
.git
.env
.env.backup
.phpunit.result.cache
storage/*.key
```

## ⚙️ Adım 5: Easypanel Servis Yapılandırması

### 5.1 Laravel App Servisi

1. Proje sayfasında **"Services"** → **"Add Service"**
2. **Service Type**: `Laravel` veya `Web`
3. **Service Name**: `app`
4. **Build Settings**:
   - **Dockerfile Path**: `./Dockerfile` (veya boş bırak, otomatik algılar)
   - **Build Context**: `.`

### 5.2 PostgreSQL Database

1. **"Add Service"** → **"PostgreSQL"**
2. **Service Name**: `postgres`
3. **Database Name**: `codexflow_saas`
4. **User**: `codexflow`
5. **Password**: Güçlü bir şifre oluştur (not al!)

### 5.3 Redis (Opsiyonel)

1. **"Add Service"** → **"Redis"**
2. **Service Name**: `redis`

## 🔐 Adım 6: Environment Variables

### 6.1 App Servisinde Environment Variables

1. `app` servisine git
2. **"Environment"** veya **"Env"** sekmesine tıkla
3. Şu değişkenleri ekle:

```env
APP_NAME=CodexFlow SaaS
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_URL=https://your-domain.easypanel.host

DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=codexflow_saas
DB_USERNAME=codexflow
DB_PASSWORD=POSTGRES_PASSWORD_BURAYA

REDIS_HOST=redis
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"
```

### 6.2 APP_KEY Oluştur

1. **Terminal** veya **Console** sekmesine git
2. Şu komutu çalıştır:
```bash
php artisan key:generate --show
```
3. Çıkan key'i kopyala ve `APP_KEY` environment variable'ına yapıştır

## 📦 Adım 7: İlk Deployment

### 7.1 Build ve Deploy

1. **"Deploy"** veya **"Build"** butonuna tıkla
2. Build tamamlanana kadar bekle (2-5 dakika)
3. Logları kontrol et

### 7.2 Database Migration

1. Build tamamlandıktan sonra **"Terminal"** veya **"Console"** sekmesine git
2. Şu komutları çalıştır:

```bash
# Migration'ları çalıştır
php artisan migrate --force

# İlk admin kullanıcı oluştur (opsiyonel)
php artisan tinker
```

Tinker'da:
```php
$tenant = \App\Models\Tenant::create([
    'name' => 'Test Company',
    'slug' => 'test-company',
    'email' => 'admin@example.com',
]);

$user = \App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => Hash::make('password123'),
    'tenant_id' => $tenant->id,
]);
```

## 🌍 Adım 8: Domain Yapılandırması

### 8.1 Custom Domain (Opsiyonel)

1. **"Domains"** sekmesine git
2. **"Add Domain"** tıkla
3. Domain'inizi girin: `saas.yourdomain.com`
4. DNS kayıtlarını yapılandırın (Easypanel size talimat verir)

### 8.2 Easypanel Subdomain

Easypanel otomatik olarak bir subdomain verir:
```
https://codexflow-saas.yourproject.easypanel.host
```

## ✅ Adım 9: İlk Test

### 9.1 Uygulamayı Aç

1. Easypanel'de **"Open"** veya domain linkine tıkla
2. Laravel welcome sayfası görünmeli

### 9.2 Health Check

1. Browser'da şu URL'yi aç:
```
https://your-domain/health
```
2. Veya terminal'de:
```bash
curl https://your-domain
```

## 🔧 Adım 10: Laravel SaaS Özelliklerini Ekle

### 10.1 Temel Paketleri Yükle

Terminal'de:

```bash
composer require laravel/breeze
composer require laravel/sanctum
composer require spatie/laravel-permission
composer require stripe/stripe-php

# Breeze kurulumu
php artisan breeze:install vue --inertia

# Sanctum publish
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 10.2 Migration'ları Oluştur

```bash
# Tenant migration
php artisan make:migration create_tenants_table
php artisan make:migration add_tenant_id_to_users_table

# API Keys migration
php artisan make:migration create_api_keys_table

# Usage tracking migration
php artisan make:migration create_usage_logs_table

# Subscriptions migration
php artisan make:migration create_subscriptions_table
```

### 10.3 Migration Dosyalarını Doldur

`LARAVEL_SAAS_GUIDE.md` dosyasındaki migration örneklerini kullan.

### 10.4 Migration'ları Çalıştır

```bash
php artisan migrate --force
```

## 📝 Adım 11: Git Workflow

### Değişiklikleri Push Et

```bash
# Local'de değişiklik yap
git add .
git commit -m "Add SaaS features"
git push origin main
```

Easypanel otomatik olarak:
1. Git'ten çeker
2. Build eder
3. Deploy eder

## 🎯 Sonraki Adımlar

1. ✅ Multi-tenant middleware ekle
2. ✅ API key authentication
3. ✅ Subscription sistemi
4. ✅ Usage tracking
5. ✅ Dashboard (Inertia + Vue)
6. ✅ Stripe entegrasyonu

Detaylı kod örnekleri için `LARAVEL_SAAS_GUIDE.md` dosyasına bakın.

## 🆘 Sorun Giderme

### Build Hatası
- Dockerfile'ı kontrol et
- Logları incele
- Environment variables'ı kontrol et

### Database Bağlantı Hatası
- `DB_HOST=postgres` olduğundan emin ol
- PostgreSQL servisinin çalıştığını kontrol et
- Password'ü doğru girdiğinden emin ol

### Migration Hatası
- `--force` flag'i kullan (production'da)
- Database permissions'ı kontrol et

## 📞 Yardım

Herhangi bir adımda takılırsanız:
1. Easypanel loglarını kontrol et
2. Terminal'de hata mesajlarını oku
3. `LARAVEL_SAAS_GUIDE.md` dosyasına bak

