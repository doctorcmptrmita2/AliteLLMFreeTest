# CF-X Model VSCode Extension'da Görünürlük

## Sorun
CF-X modeli VSCode CodexFlow extension'ında model listesinde görünmüyor.

## Çözüm

### 1. LiteLLM Config Güncellemesi
CF-X modeli config dosyasına eklendi:
- `cf-x` - Ana model adı
- `cf-x-3-layer` - Alternatif açıklayıcı isim

### 2. LiteLLM Servisini Restart Et
Config değişikliklerinin yüklenmesi için:

**Easypanel'de:**
1. LiteLLM servisini bul
2. "Restart" butonuna tıkla

**Local'de:**
```bash
docker-compose restart litellm
```

### 3. VSCode Extension'da Model Listesini Yenile
1. VSCode'da CodexFlow ayarlarına git
2. "Modelleri Yenile" (Refresh Models) butonuna tıkla
3. Model listesinde `cf-x` veya `cf-x-3-layer` görünmeli

## CF-X Model Özellikleri

CF-X seçildiğinde:
- **Plan**: DeepSeek V3.2 (Reasoning)
- **Code**: MiniMax M2.1 (Coding optimized)
- **Review**: Gemini 2.5 Flash (Code review)

## Not

CF-X bir "virtual model"dir - orchestrator tarafından yönetilir:
- LiteLLM'de normal bir model gibi görünür
- Ama aslında 3 ayrı model çağrısı yapar
- VSCode extension'dan kullanılabilir

## Test

1. LiteLLM restart edildikten sonra
2. VSCode extension'da "Modelleri Yenile"
3. Model listesinde `cf-x` veya `cf-x-3-layer` görünmeli
4. Seçip kullanabilirsiniz


