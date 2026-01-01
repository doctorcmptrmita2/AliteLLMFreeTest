# Laravel SaaS - Migration Dosyaları

## 📋 Tüm Migration'lar

### 1. Tenants Table

```php
// database/migrations/2024_01_01_000001_create_tenants_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
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
    }

    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
```

### 2. Add tenant_id to users

```php
// database/migrations/2024_01_01_000002_add_tenant_id_to_users_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('tenant_id')->nullable()->after('id')->constrained()->onDelete('cascade');
            $table->index('tenant_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
            $table->dropColumn('tenant_id');
        });
    }
};
```

### 3. API Keys Table

```php
// database/migrations/2024_01_01_000003_create_api_keys_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('key')->unique();
            $table->timestamp('last_used_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('tenant_id');
            $table->index('key');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_keys');
    }
};
```

### 4. Usage Logs Table

```php
// database/migrations/2024_01_01_000004_create_usage_logs_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usage_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('api_key_id')->nullable()->constrained()->onDelete('set null');
            $table->string('endpoint');
            $table->string('method', 10);
            $table->integer('status_code');
            $table->integer('response_time')->nullable(); // milliseconds
            $table->integer('tokens_used')->default(0);
            $table->decimal('cost', 10, 6)->default(0);
            $table->json('metadata')->nullable();
            $table->timestamp('created_at');
            
            $table->index(['tenant_id', 'created_at']);
            $table->index('api_key_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usage_logs');
    }
};
```

### 5. Subscriptions Table

```php
// database/migrations/2024_01_01_000005_create_subscriptions_table.php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->string('plan_id'); // free, starter, pro
            $table->string('stripe_subscription_id')->nullable()->unique();
            $table->string('stripe_customer_id')->nullable();
            $table->string('status'); // active, canceled, past_due, trialing
            $table->timestamp('current_period_start');
            $table->timestamp('current_period_end');
            $table->boolean('cancel_at_period_end')->default(false);
            $table->timestamp('canceled_at')->nullable();
            $table->timestamps();
            
            $table->index('tenant_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
```

## 🎯 Migration'ları Çalıştır

```bash
# Tüm migration'ları çalıştır
php artisan migrate

# Veya production'da
php artisan migrate --force
```

## 📝 Model Dosyaları

### Tenant Model

```php
// app/Models/Tenant.php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'domain',
        'email',
        'settings',
        'trial_ends_at',
        'is_active',
    ];

    protected $casts = [
        'settings' => 'array',
        'trial_ends_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function apiKeys()
    {
        return $this->hasMany(ApiKey::class);
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class);
    }
}
```

### API Key Model

```php
// app/Models/ApiKey.php
<?php

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

    protected $casts = [
        'last_used_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($apiKey) {
            if (empty($apiKey->key)) {
                $apiKey->key = 'cf_' . Str::random(48);
            }
        });
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
```

Bu migration'ları kullanarak hızlıca başlayabilirsiniz!


