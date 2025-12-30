# Production Migration Guide

## 🎉 Artık Gerçek Bir Proje!

Sistem artık production-ready PostgreSQL database kullanıyor. In-memory store yerine tüm veriler kalıcı olarak saklanıyor.

## Yapılan Değişiklikler

### ✅ Database
- **Prisma ORM** eklendi
- **PostgreSQL** entegrasyonu tamamlandı
- **Database migrations** hazır
- **Type-safe queries** ile güvenli veri erişimi

### ✅ Authentication
- Kullanıcılar PostgreSQL'de saklanıyor
- API key'ler kullanıcılara bağlı
- Restart'ta veri kaybı yok

### ✅ Production Features
- Database migrations
- Seed scripts
- Environment variables
- Error handling

## Kurulum Adımları

### 1. Database Migration

```bash
cd apps/dashboard
pnpm install
pnpm db:migrate
```

Bu komut:
- Database schema'yı oluşturur
- `users` ve `user_api_keys` tablolarını yaratır

### 2. Seed Database (Opsiyonel)

Test kullanıcısını oluşturmak için:

```bash
pnpm db:seed
```

Veya API endpoint'ini kullanın:
```bash
POST /api/admin/seed
Authorization: Bearer admin-seed-key-2025
```

### 3. Environment Variables

Easypanel'de dashboard servisine ekleyin:

```env
DATABASE_URL=postgresql://litellm:litellm_pass@postgres:5432/litellm
AUTH_SECRET=your-secret-key-here-change-in-production
SEED_TEST_USER=false  # true yaparsanız otomatik seed eder
```

### 4. Rebuild

```bash
# Easypanel'de rebuild yapın veya
git push  # Auto-deploy varsa
```

## Database Schema

### Users Table
```sql
- id (cuid)
- email (unique)
- name
- password_hash
- created_at
- updated_at
```

### User API Keys Table
```sql
- id (cuid)
- user_id (foreign key)
- key_id (LiteLLM API key)
- key_name
- created_at
```

## Migration Komutları

```bash
# Yeni migration oluştur
pnpm db:migrate

# Prisma Client generate et
pnpm db:generate

# Database'i reset et (DİKKAT: Tüm veriler silinir!)
prisma migrate reset

# Prisma Studio (GUI)
pnpm db:studio
```

## Test Kullanıcı

- **Email:** `doctor.cmptr.mita2@gmail.com`
- **Password:** `test123456` (production'da değiştirin!)
- **API Key:** `sk-nWqZQbczxgZPWPrQjdpWTA`

## Production Checklist

- [x] PostgreSQL database kuruldu
- [x] Prisma ORM entegre edildi
- [x] Database migrations hazır
- [x] Authentication database'e taşındı
- [x] API key management database'de
- [ ] Production'da `AUTH_SECRET` değiştirildi
- [ ] Production'da test password değiştirildi
- [ ] Database backup stratejisi belirlendi

## Notlar

- Artık restart'ta veri kaybı yok! 🎉
- Tüm kullanıcılar ve API key'ler PostgreSQL'de
- Migration'lar ile schema güncellemeleri kolay
- Type-safe database queries ile hata riski azaldı

## Sorun Giderme

### Migration hatası
```bash
# Database'i reset edip tekrar dene
prisma migrate reset
pnpm db:migrate
```

### Connection hatası
- `DATABASE_URL` environment variable'ını kontrol et
- PostgreSQL container'ının çalıştığından emin ol
- Network ayarlarını kontrol et

### Seed hatası
- Database migration'ların çalıştığından emin ol
- `DATABASE_URL` doğru mu kontrol et

