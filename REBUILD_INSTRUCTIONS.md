# Package Yükleme ve Rebuild Talimatları

## Easypanel'de Rebuild (Önerilen)

1. Easypanel Dashboard'a gidin: https://easypanel.io
2. Projenizi seçin
3. "dashboard" servisini bulun
4. "Rebuild" veya "Redeploy" butonuna tıklayın
5. Build tamamlanana kadar bekleyin (2-5 dakika)

## Local Development İçin

Eğer local'de test etmek istiyorsanız:

```bash
# 1. Proje dizinine gidin
cd C:\wamp64\www\AliteLLMFreeTest

# 2. Dashboard container'ını rebuild edin
docker-compose build dashboard

# 3. Container'ı yeniden başlatın
docker-compose up -d dashboard

# 4. Logları kontrol edin
docker-compose logs -f dashboard
```

## Yeni Eklenen Package'lar

- `pg` - PostgreSQL client (database fallback için)
- `@types/pg` - TypeScript type definitions

Bu package'lar `apps/dashboard/package.json` dosyasına eklendi ve Dockerfile'da `pnpm install` komutu ile otomatik yüklenecek.

## Not

Easypanel kullanıyorsanız, sadece Easypanel'de rebuild yapmanız yeterli. Local'de test etmenize gerek yok.


