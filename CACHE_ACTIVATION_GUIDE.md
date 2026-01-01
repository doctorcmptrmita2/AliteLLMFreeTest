# Cache Aktivasyon Rehberi

## 🔴 Sorun

**Tüm isteklerde cache kapalı:**
```
cache_hit='False'
cache_key='Cache OFF'
cached_tokens: 0
```

**Etkisi:**
- Her istekte 40K+ token işleniyor
- Yanıt süreleri: 1-5 dakika
- Maliyet: $0.013/istek
- **%90+ maliyet tasarrufu kaybediliyor!**

---

## ✅ Çözüm

### 1. Config Dosyası Güncellendi

**litellm_config.yaml:**
```yaml
general_settings:
  cache:
    type: "redis"  # Use Redis if available, otherwise in_memory
    ttl: 3600  # Cache TTL: 1 hour
    prompt_cache: true  # Enable prompt caching
    completion_cache: true  # Enable completion caching
```

### 2. LiteLLM Restart Gerekli

**Docker Compose ile:**
```bash
docker compose restart litellm
```

**Veya:**
```bash
docker compose down
docker compose up -d
```

### 3. Redis Kontrolü

**Redis çalışıyor mu?**
```bash
docker compose ps redis
```

**Redis bağlantısı:**
```bash
docker compose exec redis redis-cli ping
# Cevap: PONG olmalı
```

---

## 📊 Beklenen İyileştirmeler

### Önceki Durum (Cache OFF)

- **Prompt tokens**: 40,000+ (her istekte)
- **Yanıt süresi**: 1-5 dakika
- **Maliyet**: $0.013/istek
- **Cache hit**: 0%

### Yeni Durum (Cache ON)

- **İlk istek**: 40,000 token (cache'e yazılır)
- **Sonraki istekler**: ~1,000 token (sadece yeni kısım)
- **Yanıt süresi**: 
  - İlk istek: 1-5 dakika
  - Cache hit: 2-5 saniye ⚡
- **Maliyet**: 
  - İlk istek: $0.013
  - Cache hit: $0.0003 (%97 tasarruf!)
- **Cache hit oranı**: %70-90 (beklenen)

---

## 🔍 Cache Durumu Kontrolü

### 1. LiteLLM Logları

**Cache aktif ise:**
```
cache_hit='True'
cache_key='cache_key_hash_here'
cached_tokens: 35000  # Cache'den okunan token sayısı
```

**Cache kapalı ise:**
```
cache_hit='False'
cache_key='Cache OFF'
cached_tokens: 0
```

### 2. LiteLLM UI

- Admin UI'da cache istatistiklerini kontrol et
- Cache hit rate'i görüntüle
- Cache size'i kontrol et

---

## 🚀 Sonraki Adımlar

1. ✅ **Config güncellendi** - Cache ayarları eklendi
2. ⏳ **LiteLLM restart** - Değişikliklerin aktif olması için
3. ⏳ **Test** - Cache'in çalıştığını doğrula
4. ⏳ **Monitor** - Cache hit rate'i izle

---

## 📝 Notlar

- **Redis yoksa**: `type: "in_memory"` kullanılır (daha az etkili)
- **TTL**: 1 saat (3600 saniye) - ayarlanabilir
- **Prompt cache**: Sistem promptları ve tekrar eden içerikler cache'lenir
- **Completion cache**: Aynı prompt için aynı response cache'lenir

**Öncelik**: LiteLLM'i restart et - cache hemen aktif olacak!

