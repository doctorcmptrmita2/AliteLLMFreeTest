# LiteLLM Servisini Restart Etme

## Sorun
Yeni eklenen modeller (MiniMax M2.1, CF-X) dashboard'da görünmüyor.

## Çözüm: LiteLLM Servisini Restart Et

LiteLLM config dosyası değiştiğinde servisi restart etmek gerekir.

### Easypanel'de Restart

1. Easypanel dashboard'a git
2. LiteLLM servisini bul
3. "Restart" butonuna tıkla
4. Veya "Deploy" butonuna tıkla (config dosyası otomatik yenilenecek)

### Docker Compose ile (Local)

```bash
docker-compose restart litellm
```

### Config Dosyası Kontrolü

Config dosyasında şu modeller olmalı:
- ✅ `openrouter/minimax/minimax-m2.1` (Satır 89-94)
- ✅ `cf-x` (Satır 98-102)

## Not: CF-X Modeli

CF-X bir "virtual model"dir - orchestrator tarafından yönetilir:
- LiteLLM dashboard'da görünmeyebilir (normal)
- Orchestrator tarafından 3 ayrı model çağrısı yapılır:
  1. DeepSeek V3.2 (Plan)
  2. MiniMax M2.1 (Code)
  3. Gemini 2.5 Flash (Review)

CF-X'i kullanmak için:
```bash
docker-compose run --rm orchestrator run "Task" --cf-x
```

## MiniMax M2.1 Kontrolü

MiniMax M2.1 normal bir model olarak eklenmiş, dashboard'da görünmeli:
- Model ID: `openrouter/minimax/minimax-m2.1`
- OpenRouter path: `openrouter/minimax/minimax-m2.1`

Eğer görünmüyorsa:
1. LiteLLM servisini restart et
2. Config dosyasının doğru mount edildiğinden emin ol
3. LiteLLM loglarını kontrol et


