# Dashboard Migration Sorunu - Çözüm

## Sorun
Dashboard'da `users` tablosu bulunamıyor:
```
ERROR: relation "public.users" does not exist
```

## Neden
Dashboard'ın Dockerfile'ında Prisma migration'ları çalıştırılmıyor. Sadece `prisma generate` yapılıyor ama database'e migration uygulanmıyor.

## Çözüm

### 1. Dockerfile Güncellendi ✅
- Entrypoint script eklendi
- Container başlarken `prisma migrate deploy` çalışacak
- Migration'lar otomatik uygulanacak

### 2. Easypanel'de Rebuild
1. Dashboard servisini bul
2. "Rebuild" veya "Deploy" butonuna tıkla
3. Migration'lar otomatik çalışacak

### 3. Manuel Migration (Alternatif)
Eğer rebuild yapmak istemiyorsan, container içinde:

```bash
# Dashboard container'ına gir
docker exec -it <dashboard-container-id> sh

# Migration çalıştır
cd /app/apps/dashboard
npx prisma migrate deploy
```

## Beklenen Sonuç

Migration sonrası:
- ✅ `users` tablosu oluşacak
- ✅ `user_api_keys` tablosu oluşacak
- ✅ Dashboard çalışacak
- ✅ LiteLLM modelleri görünecek (zaten yüklü)

## Not

LiteLLM modelleri zaten yüklü:
```
Initialized Model List ['gpt-4o-mini-2024-07-18', ..., 'openrouter/minimax/minimax-m2.1', 'cf-x']
```

Sadece dashboard'ın database migration'larını çalıştırmak gerekiyor.

