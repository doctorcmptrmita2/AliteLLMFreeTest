# Laravel SaaS - Hızlı Başlangıç

## 🚀 5 Dakikada Başla

### 1. Proje Oluştur

```bash
# Laravel kurulumu
composer create-project laravel/laravel codexflow-saas
cd codexflow-saas

# Temel paketler
composer require laravel/breeze laravel/sanctum spatie/laravel-permission
php artisan breeze:install vue --inertia
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
```

### 2. Database Setup

```bash
# .env dosyasını düzenle
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_DATABASE=codexflow_saas

# Migration'ları çalıştır
php artisan migrate
```

### 3. Tenant Sistemi (Basit Versiyon)

```php
// database/migrations/xxxx_create_tenants_table.php
Schema::create('tenants', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('email');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});

// app/Models/User.php - tenant_id ekle
Schema::table('users', function (Blueprint $table) {
    $table->foreignId('tenant_id')->nullable()->constrained();
});
```

### 4. API Key Sistemi

```php
// database/migrations/xxxx_create_api_keys_table.php
Schema::create('api_keys', function (Blueprint $table) {
    $table->id();
    $table->foreignId('tenant_id')->constrained();
    $table->string('name');
    $table->string('key')->unique();
    $table->timestamp('last_used_at')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

### 5. İlk Tenant Oluştur

```php
// database/seeders/TenantSeeder.php
Tenant::create([
    'name' => 'Test Company',
    'slug' => 'test-company',
    'email' => 'test@example.com',
]);

User::create([
    'name' => 'Admin',
    'email' => 'admin@test-company.com',
    'password' => Hash::make('password'),
    'tenant_id' => 1,
]);
```

## 📦 Easypanel Deployment

**Detaylı adım adım rehber için `EASYPANEL_LARAVEL_SETUP.md` dosyasına bakın!**

### Hızlı Özet:

1. **Git Repository**: GitHub'a push et
2. **Easypanel**: New Project → Laravel
3. **Environment**: `.env` değişkenlerini ekle
4. **Build**: Otomatik build başlar
5. **Migration**: Container içinde `php artisan migrate`

## 🎯 Minimal Çalışan Örnek

Bu yapı ile hemen başlayabilirsiniz. Detaylar için:
- **Easypanel Setup**: `EASYPANEL_LARAVEL_SETUP.md`
- **Kapsamlı Rehber**: `LARAVEL_SAAS_GUIDE.md`
- **Migration'lar**: `LARAVEL_MIGRATIONS.md`

