# Laravel SaaS Projesi - Kapsamlı Rehber

## 🎯 Proje Önerisi: CodexFlow SaaS Platform

### Mimari Önerileri

#### 1. **Multi-Tenancy Yaklaşımı**
- **Shared Database + Tenant ID**: En basit ve ölçeklenebilir
- Her tabloda `tenant_id` kolonu
- Middleware ile otomatik tenant filtreleme

#### 2. **Teknoloji Stack**
```
Backend: Laravel 11
Frontend: Inertia.js + Vue 3 / React
Database: PostgreSQL (production-ready)
Queue: Redis + Laravel Horizon
Cache: Redis
Payment: Stripe / Paddle
Auth: Laravel Sanctum (API) + Laravel Breeze (Web)
```

#### 3. **Temel Özellikler**
- ✅ Multi-tenant yapı
- ✅ Kullanıcı yönetimi (Admin, User rolleri)
- ✅ Subscription yönetimi
- ✅ API key yönetimi
- ✅ Usage tracking & billing
- ✅ Dashboard & Analytics
- ✅ Webhook sistemi

## 📁 Proje Yapısı

```
codexflow-saas/
├── app/
│   ├── Models/
│   │   ├── Tenant.php
│   │   ├── User.php
│   │   ├── Subscription.php
│   │   ├── ApiKey.php
│   │   └── UsageLog.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Tenant/
│   │   │   ├── Api/
│   │   │   └── Admin/
│   │   ├── Middleware/
│   │   │   ├── IdentifyTenant.php
│   │   │   └── EnsureSubscriptionActive.php
│   │   └── Requests/
│   ├── Services/
│   │   ├── TenantService.php
│   │   ├── SubscriptionService.php
│   │   ├── BillingService.php
│   │   └── UsageTrackingService.php
│   └── Jobs/
│       └── ProcessUsage.php
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   ├── web.php
│   ├── api.php
│   └── tenant.php
└── resources/
    └── js/
```

## 🚀 Kurulum Adımları

### 1. Laravel Projesi Oluşturma

```bash
# Yeni Laravel projesi
composer create-project laravel/laravel codexflow-saas

cd codexflow-saas

# Gerekli paketler
composer require laravel/breeze
composer require laravel/sanctum
composer require laravel/horizon
composer require spatie/laravel-permission
composer require stripe/stripe-php
composer require inertiajs/inertia-laravel
```

### 2. Database Yapılandırması

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=codexflow_saas
DB_USERNAME=codexflow
DB_PASSWORD=your_password
```

### 3. Multi-Tenancy Kurulumu

#### Migration: tenants table
```php
Schema::create('tenants', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique();
    $table->string('domain')->nullable();
    $table->string('email');
    $table->json('settings')->nullable();
    $table->timestamp('trial_ends_at')->nullable();
    $table->boolean('is_active')->default(true);
    $table->timestamps();
});
```

#### Migration: Add tenant_id to all tables
```php
Schema::table('users', function (Blueprint $table) {
    $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
    $table->index('tenant_id');
});
```

### 4. Tenant Middleware

```php
// app/Http/Middleware/IdentifyTenant.php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Tenant;

class IdentifyTenant
{
    public function handle(Request $request, Closure $next)
    {
        // Domain'den tenant bul
        $domain = $request->getHost();
        $tenant = Tenant::where('domain', $domain)
            ->orWhere('slug', $request->route('tenant'))
            ->firstOrFail();
        
        // Tenant'ı request'e ekle
        $request->merge(['tenant' => $tenant]);
        app()->instance('tenant', $tenant);
        
        // Global scope ekle
        Tenant::addGlobalScope('tenant', function ($query) use ($tenant) {
            $query->where('tenant_id', $tenant->id);
        });
        
        return $next($request);
    }
}
```

## 💳 Subscription Sistemi

### Subscription Model

```php
// app/Models/Subscription.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    protected $fillable = [
        'tenant_id',
        'plan_id',
        'stripe_subscription_id',
        'status', // active, canceled, past_due
        'current_period_start',
        'current_period_end',
        'cancel_at_period_end',
    ];
    
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
    
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && $this->current_period_end > now();
    }
}
```

### Subscription Plans

```php
// config/subscriptions.php
return [
    'plans' => [
        'free' => [
            'name' => 'Free',
            'price' => 0,
            'limits' => [
                'api_calls' => 1000,
                'api_keys' => 1,
                'users' => 1,
            ],
        ],
        'starter' => [
            'name' => 'Starter',
            'price' => 29,
            'stripe_price_id' => 'price_xxx',
            'limits' => [
                'api_calls' => 10000,
                'api_keys' => 5,
                'users' => 5,
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'price' => 99,
            'stripe_price_id' => 'price_yyy',
            'limits' => [
                'api_calls' => 100000,
                'api_keys' => 20,
                'users' => 20,
            ],
        ],
    ],
];
```

## 🔑 API Key Yönetimi

### API Key Model

```php
// app/Models/ApiKey.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ApiKey extends Model
{
    protected $fillable = [
        'tenant_id',
        'name',
        'key',
        'last_used_at',
        'is_active',
    ];
    
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($apiKey) {
            $apiKey->key = 'cf_' . Str::random(48);
        });
    }
    
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

### API Authentication Middleware

```php
// app/Http/Middleware/AuthenticateApiKey.php
namespace App\Http\Middleware;

use Closure;
use App\Models\ApiKey;

class AuthenticateApiKey
{
    public function handle($request, Closure $next)
    {
        $key = $request->header('X-API-Key') 
            ?? $request->bearerToken();
        
        if (!$key) {
            return response()->json(['error' => 'API key required'], 401);
        }
        
        $apiKey = ApiKey::where('key', $key)
            ->where('is_active', true)
            ->first();
        
        if (!$apiKey) {
            return response()->json(['error' => 'Invalid API key'], 401);
        }
        
        // Update last used
        $apiKey->update(['last_used_at' => now()]);
        
        // Set tenant
        app()->instance('tenant', $apiKey->tenant);
        
        return $next($request);
    }
}
```

## 📊 Usage Tracking

### Usage Log Model

```php
// app/Models/UsageLog.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsageLog extends Model
{
    protected $fillable = [
        'tenant_id',
        'api_key_id',
        'endpoint',
        'method',
        'status_code',
        'response_time',
        'tokens_used',
        'cost',
    ];
    
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
    
    public function apiKey()
    {
        return $this->belongsTo(ApiKey::class);
    }
}
```

### Usage Tracking Middleware

```php
// app/Http/Middleware/TrackUsage.php
namespace App\Http\Middleware;

use Closure;
use App\Models\UsageLog;
use Illuminate\Support\Facades\DB;

class TrackUsage
{
    public function handle($request, Closure $next)
    {
        $startTime = microtime(true);
        
        $response = $next($request);
        
        $tenant = app('tenant');
        $apiKey = $request->user(); // API key from middleware
        
        // Async olarak kaydet
        dispatch(function () use ($tenant, $apiKey, $request, $response, $startTime) {
            UsageLog::create([
                'tenant_id' => $tenant->id,
                'api_key_id' => $apiKey->id,
                'endpoint' => $request->path(),
                'method' => $request->method(),
                'status_code' => $response->getStatusCode(),
                'response_time' => (microtime(true) - $startTime) * 1000,
                'tokens_used' => $this->extractTokens($response),
                'cost' => $this->calculateCost($response),
            ]);
        })->afterResponse();
        
        return $response;
    }
}
```

## 🎨 Frontend (Inertia.js + Vue 3)

### Dashboard Component

```vue
<!-- resources/js/Pages/Dashboard.vue -->
<template>
  <div>
    <h1>Dashboard</h1>
    
    <!-- Stats -->
    <div class="grid grid-cols-4 gap-4">
      <StatCard 
        title="API Calls" 
        :value="stats.totalCalls"
        :change="stats.callsChange"
      />
      <StatCard 
        title="Cost" 
        :value="`$${stats.totalCost}`"
        :change="stats.costChange"
      />
      <StatCard 
        title="Active Keys" 
        :value="stats.activeKeys"
      />
      <StatCard 
        title="Usage" 
        :value="`${stats.usagePercent}%`"
      />
    </div>
    
    <!-- Charts -->
    <UsageChart :data="usageData" />
  </div>
</template>

<script setup>
import { Head } from '@inertiajs/vue3';
import StatCard from '@/Components/StatCard.vue';
import UsageChart from '@/Components/UsageChart.vue';

defineProps({
  stats: Object,
  usageData: Array,
});
</script>
```

## 🔄 API Routes

```php
// routes/api.php
use Illuminate\Support\Facades\Route;

// Public API (API key required)
Route::middleware(['api.key', 'track.usage'])->group(function () {
    Route::post('/v1/chat/completions', [ApiController::class, 'chatCompletions']);
    Route::post('/v1/completions', [ApiController::class, 'completions']);
});

// Tenant Dashboard API (Auth required)
Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
    Route::get('/api/keys', [ApiKeyController::class, 'index']);
    Route::post('/api/keys', [ApiKeyController::class, 'store']);
    Route::delete('/api/keys/{key}', [ApiKeyController::class, 'destroy']);
    
    Route::get('/api/usage', [UsageController::class, 'index']);
    Route::get('/api/stats', [StatsController::class, 'index']);
});
```

## 💰 Stripe Integration

### Subscription Controller

```php
// app/Http/Controllers/SubscriptionController.php
namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Stripe\Stripe;

class SubscriptionController extends Controller
{
    public function checkout(Request $request, $planId)
    {
        $tenant = $request->user()->tenant;
        $plan = config("subscriptions.plans.{$planId}");
        
        $checkout = \Stripe\Checkout\Session::create([
            'customer_email' => $tenant->email,
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $plan['stripe_price_id'],
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => route('subscription.success'),
            'cancel_url' => route('subscription.cancel'),
            'metadata' => [
                'tenant_id' => $tenant->id,
            ],
        ]);
        
        return redirect($checkout->url);
    }
    
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        
        $event = \Stripe\Webhook::constructEvent(
            $payload, $sigHeader, config('services.stripe.webhook_secret')
        );
        
        switch ($event->type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                $this->handleSubscriptionUpdate($event->data->object);
                break;
        }
        
        return response()->json(['received' => true]);
    }
}
```

## 📦 Docker Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    volumes:
      - .:/var/www/html
    depends_on:
      - postgres
      - redis
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: codexflow_saas
      POSTGRES_USER: codexflow
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## 🚀 Deployment (Easypanel)

### 1. Git Repository Oluştur
```bash
git init
git add .
git commit -m "Initial Laravel SaaS project"
git remote add origin https://github.com/yourusername/codexflow-saas.git
git push -u origin main
```

### 2. Easypanel'de Yeni Proje
- New Project → Laravel
- Git repository'yi bağla
- Environment variables ekle:
  ```
  APP_ENV=production
  APP_KEY=base64:...
  DB_CONNECTION=pgsql
  DB_HOST=postgres
  STRIPE_KEY=sk_live_...
  STRIPE_SECRET=sk_live_...
  ```

### 3. Database Migration
```bash
php artisan migrate --force
php artisan db:seed --force
```

## 📝 Önemli Notlar

1. **Multi-tenancy**: Her sorguda `tenant_id` kontrolü yap
2. **Rate Limiting**: Plan limitlerine göre throttle
3. **Queue**: Usage tracking'i queue'ya al (performans)
4. **Caching**: Tenant bilgilerini cache'le
5. **Security**: API key'leri hash'le (bcrypt)
6. **Monitoring**: Laravel Telescope ekle (dev için)

## 🎯 Sonraki Adımlar

1. ✅ Laravel projesi oluştur
2. ✅ Multi-tenancy kur
3. ✅ Subscription sistemi
4. ✅ API key yönetimi
5. ✅ Usage tracking
6. ✅ Stripe entegrasyonu
7. ✅ Dashboard (Inertia + Vue)
8. ✅ Testing
9. ✅ Deployment

Bu yapı ile production-ready bir SaaS platformu oluşturabilirsiniz! 🚀

