# LiteLLM Dashboard'da Modeller Görünmüyor - Çözüm

## Sorun
LiteLLM dashboard'da (`/ui/?page=models`) modeller görünmüyor.

## Olası Nedenler ve Çözümler

### 1. Config Dosyası Syntax Hatası ✅ DÜZELTİLDİ
- `model_info` alanı LiteLLM tarafından desteklenmiyor
- Bu alan kaldırıldı

### 2. LiteLLM Servisi Restart Edilmeli
Config değişikliklerinin yüklenmesi için:

**Easypanel'de:**
1. LiteLLM servisini bul
2. "Restart" butonuna tıkla
3. Veya "Deploy" butonuna tıkla (config dosyası yeniden yüklenecek)

### 3. Config Dosyası Mount Kontrolü
Docker compose'da config dosyası doğru mount edilmiş mi kontrol et:

```yaml
volumes:
  - ./litellm_config.yaml:/app/litellm_config.yaml:ro
```

### 4. LiteLLM Loglarını Kontrol Et
Easypanel'de LiteLLM servisinin loglarını kontrol et:
- Config dosyası okunuyor mu?
- Hata var mı?
- Modeller yükleniyor mu?

### 5. Master Key Kontrolü
Dashboard'a erişmek için master key gerekli:
```yaml
master_key: "sk-litellm-master-key-2025-roo-code-orchestrator"
```

Environment variable olarak da set edilebilir:
```env
LITELLM_MASTER_KEY=sk-litellm-master-key-2025-roo-code-orchestrator
```

### 6. API Key Kontrolü
OpenRouter API key set edilmiş mi?
```env
OPENROUTER_API_KEY=sk-or-v1-xxx
```

## Adım Adım Çözüm

1. ✅ Config dosyasını düzelt (model_info kaldırıldı)
2. ⏳ LiteLLM servisini restart et
3. ⏳ Dashboard'u yenile (`/ui/?page=models`)
4. ⏳ Logları kontrol et

## Beklenen Sonuç

Restart sonrası dashboard'da şu modeller görünmeli:
- gpt-4o-mini-2024-07-18
- openrouter/xiaomi/mimo-v2-flash:free
- openrouter/kwaipilot/kat-coder-pro:free
- openrouter/mistralai/devstral-2512:free
- openrouter/qwen/qwen3-coder:free
- openrouter/deepseek/deepseek-v3.2
- openrouter/anthropic/claude-sonnet-4.5
- openrouter/x-ai/grok-4.1-fast
- openrouter/z-ai/glm-4.6
- openrouter/google/gemini-2.5-flash
- openrouter/amazon/nova-2-lite-v1
- openrouter/qwen/qwen3-30b-a3b
- openrouter/minimax/minimax-m2.1
- cf-x

## Hala Görünmüyorsa

1. LiteLLM loglarını kontrol et
2. Config dosyasının syntax'ını kontrol et (YAML validator kullan)
3. LiteLLM versiyonunu kontrol et (güncel mi?)
4. Browser console'da hata var mı kontrol et


