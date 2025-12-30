# Test Kullanıcı Kurulumu

## Test Kullanıcı Bilgileri

- **Email:** `doctor.cmptr.mita2@gmail.com`
- **API Key:** `sk-nWqZQbczxgZPWPrQjdpWTA`
- **Varsayılan Şifre:** Kayıt olurken belirleyeceksiniz

## Kurulum Yöntemleri

### Yöntem 1: Otomatik Kayıt (Önerilen)

1. Dashboard'a gidin: `https://dashbord.roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/register`
2. Email: `doctor.cmptr.mita2@gmail.com`
3. İstediğiniz şifreyi girin
4. Kayıt olun
5. API key otomatik olarak hesabınıza bağlanacak

### Yöntem 2: Admin Seed Endpoint

Eğer kullanıcı zaten varsa veya manuel oluşturmak isterseniz:

```bash
# Seed endpoint'ini çağırın
curl -X POST https://dashbord.roo-code-orchestrator-workflow-orchestrator.lc58dd.easypanel.host/api/admin/seed \
  -H "Authorization: Bearer admin-seed-key-2025"
```

**Not:** Production'da `ADMIN_SEED_KEY` environment variable'ını ayarlayın.

### Yöntem 3: Environment Variable

Easypanel'de dashboard servisinin environment variable'larına ekleyin:

```
SEED_TEST_USER=true
```

Bu sayede server başladığında otomatik olarak test kullanıcısı oluşturulur.

## API Key Kullanımı

Oluşturulan API key'i dashboard'dan görebilir ve kullanabilirsiniz:

1. Dashboard'a giriş yapın
2. "API Keys" sayfasına gidin
3. API key'iniz listede görünecek
4. Key'i kopyalayıp kullanabilirsiniz

## Notlar

- Test kullanıcısı in-memory store'da tutuluyor (restart'ta sıfırlanır)
- Production için PostgreSQL'e geçmeniz önerilir
- API key LiteLLM'de mevcut olmalı

