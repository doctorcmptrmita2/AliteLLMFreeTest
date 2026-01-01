# Container İçinde Build Yapma

## Sorun
Container içinde `tsc` komutu help mesajı gösteriyor, bu da tsconfig.json'ın bulunamadığını gösterir.

## Çözüm 1: Manuel Build (Container İçinde)

```bash
# Orchestrator dizinine git
cd /app/apps/orchestrator

# tsconfig.json'ı kontrol et
ls -la tsconfig.json
cat tsconfig.json

# tsconfig.base.json'ı kontrol et (parent dizinde olmalı)
ls -la ../../tsconfig.base.json

# Manuel build
tsc -p tsconfig.json

# Veya direkt src'den build
tsc src/index.ts --outDir dist --module esnext --target es2022 --moduleResolution node --esModuleInterop
```

## Çözüm 2: Host'ta Build (Önerilen)

Container'dan çıkıp Windows'ta:

```powershell
# Container'dan çık
exit

# Proje dizinine git
cd C:\wamp64\www\AliteLLMFreeTest

# Orchestrator'ı build et
cd apps\orchestrator
pnpm build

# Container'ı rebuild et (Easypanel'de veya local'de)
# Easypanel'de: Deploy butonuna tıkla veya rebuild yap
```

## Çözüm 3: Easypanel'de Rebuild

Easypanel dashboard'da:
1. Orchestrator servisini bul
2. "Rebuild" veya "Deploy" butonuna tıkla
3. Build otomatik olarak yapılacak

## Not
Container içinde `docker-compose` komutu yok (normal). Container içinde docker-compose kullanılamaz.


