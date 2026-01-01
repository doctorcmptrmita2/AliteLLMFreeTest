# Orchestrator Rebuild Guide

## Container İçinde Build (Hızlı)

Container içindeyken:

```bash
# Root'a dön
cd /app

# Dependencies yükle (dev dependencies dahil)
pnpm install

# Orchestrator'ı build et
cd apps/orchestrator
pnpm build
```

## Host'ta Build (Önerilen)

Container'dan çıkıp host'ta:

```bash
# Windows PowerShell'de
cd C:\wamp64\www\AliteLLMFreeTest

# Dependencies yükle
pnpm install

# Orchestrator'ı build et
cd apps\orchestrator
pnpm build

# Container'ı rebuild et
cd ..\..
docker-compose build orchestrator
```

## Docker Compose ile Rebuild

```bash
# Tüm servisleri rebuild et
docker-compose build

# Sadece orchestrator'ı rebuild et
docker-compose build orchestrator

# Rebuild ve restart
docker-compose up -d --build orchestrator
```


