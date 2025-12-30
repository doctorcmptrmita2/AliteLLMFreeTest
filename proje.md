# MEGA PROMPT — CodexFlow.dev (VS Code Extension + Web HQ Dashboard)
# Amaç: CodexFlow’u “sadece chat eklentisi” değil; bütçe kontrollü, kanıt odaklı (Proof-Driven), tool’lu AI Code Orchestrator haline getiren, profesyonel ve ölçeklenebilir bir MVP’yi TEK REPO içinde üret.

## 0) ÇALIŞMA KURALLARI (ZORUNLU)
- Çıktıları “Part 1 / Part 2 / Part 3 ...” şeklinde ver.
- Her Part’ta yalnızca ilgili dosyalarda değişiklik yap; gereksiz tüm dosyaları baştan yazma.
- Her değişikliği unified diff formatında ver (applyUnifiedDiff uyumlu).
- Güvenlik: kullanıcı onayı olmadan terminal komutu koşturma; .env ve secret dosyalar asla LLM’e gönderilmesin.
- Kod stili: TypeScript strict, ESLint/Prettier, React için clean component patterns.
- Mimari: Modüler, test edilebilir; “Core Engine” katmanlarını ayrı paketlerde tut.
- Varsayılan olarak OpenRouter veya LiteLLM gateway ile çalışacak şekilde tasarla; provider soyutlaması şart.
- “Proof-Driven” MVP’nin imzası: Her görev sonunda Proof Card (test/lint/format + çıktılar) üretmeden “Apply All” riskli mod harici sunulmasın.

## 1) ÜRÜN VAADİ (SLOGAN)
CodexFlow: “Kod yazan değil, kodunu kanıtlayan agent — üstelik bütçeyi sen yönetirsin.”

## 2) TEK REPO MONOREPO YAPISI (ZORUNLU)
Repo adı: codexflow
Paket yöneticisi: pnpm (workspace)
Klasörler:
- apps/
  - extension/                # VS Code extension (Node + TS)
  - dashboard/                # Next.js (Landing + Dashboard)
- packages/
  - core/                     # Domain modelleri, ortak tipler, event’ler
  - llm/                      # Provider abstraction (OpenRouter, LiteLLM)
  - context-engine/           # hybrid search, project graph, distiller, repo memory
  - agent/                    # planner/coder pipeline, tool interface, self-healing loop
  - edit-engine/              # unified diff apply + preview generation
  - proof/                    # validators (Laravel/WP/Generic) + ProofCard model
  - telemetry/                # cost, tokens, latency, events, local store
  - ui-webview/               # React webview UI (Chat + Agent + Proof + Diff)
- docs/
  - architecture.md
  - security.md
  - pricing-usage.md
  - workflows.md

## 3) MVP KAPSAMI (NET)
MVP’de VAR:
A) Extension UI
- Sağ panel webview: Chat + Agent Progress + Diff Preview + Proof Card + Cost
- Streaming yanıt + Stop
- Dosya referansı tıklayınca dosya açma
- Regenerate + Explain quick actions

B) Agent
- “Task → Plan → Execute → Validate → Report”
- Planner/Coder duality (ucuz planlayıcı + güçlü coder)
- Tool’lar: read_file, write_file, apply_diff, ripgrep_search, run_terminal(ask), git_ops(ask)
- Self-healing loop: terminal exit!=0 ise hata analizi + fix planı (max 2 retry) + loop guard

C) Edit Engine
- applyUnifiedDiff (güvenli patch)
- Preview + Apply/Reject + Chunk edit

D) Budget & Cost Guard (Usage-based MVP’nin kalbi)
- Task başına budget ($) + hard stop
- “Spend Guard”: %80 uyarı, distill + ucuz modele düşme
- Canlı cost/tokens/latency paneli
- Tool limitleri: max terminal runs, max file reads, max steps

E) Proof-Driven (fark yaratan)
- Proof Mode default ON
- Framework validators:
  - Laravel: pint + php artisan test (varsa)
  - WordPress: php -l + (opsiyonel) wp-cli plugin activate checks (varsa)
  - Generic: npm test/lint (package.json varsa)
- Proof Card: tests/lint/format status + log linkleri + warnings

F) Dashboard (Merkez Üs — Minimal ama gerçek)
- Landing page (Proof + Budget value prop)
- Auth (NextAuth veya Clerk; MVP için NextAuth tercih)
- Dashboard:
  - Cost & Usage charts (Recharts)
  - Task History (extension’dan gelen event’ler)
  - Team/Policy (MVP: shared rules + budget limit + provider config)
- Extension ↔ Dashboard sync (HTTP API):
  - /api/events ingest (task summary, cost, proof)
  - /api/policy fetch (budget limit, allowed tools, rules)

MVP’de YOK (V1/V2):
- Tam semantic vector DB altyapısı (MVP’de “light semantic” optional)
- Advanced refactor (rename symbol vb.)
- Enterprise SSO/RBAC/Audit log tam set

## 4) ÖNE ÇIKAN YENİLİK: PROOF-DRIVEN + BUDGET-GUARDED CODING
- “Apply All” butonu, Proof Mode başarılı ise normal; başarısız ise “Riskli Uygula” (onay + uyarı) ile ayrı.
- Her task: (a) Minimal diff, (b) validator koşumu, (c) cost raporu üretmek zorunda.

## 5) TEKNİK STACK (ÖNERİLEN, ZORUNLU UYUMLU)
Extension:
- TypeScript, VS Code Extension API
- Webview UI: React + Tailwind (Vite build) → packages/ui-webview
- Local storage: SQLite (better-sqlite3) veya vscode memento + JSON (MVP’de JSON da olur; tercihen SQLite)
- Terminal: VS Code Pseudoterminal + ask-before-run

Dashboard:
- Next.js (App Router) + shadcn/ui + Tailwind
- DB: Supabase Postgres (MVP’de SQLite + Prisma da olur; ama “Merkez Üs” için Postgres mantıklı)
- Charts: Recharts
- Auth: NextAuth
- API routes: /api/events, /api/policy

LLM:
- OpenRouter + LiteLLM gateway abstraction (packages/llm)
- Streaming desteği
- Model routing:
  - planner: cheap (ör. haiku/mini)
  - coder: strong (sonnet vb.)
  - fallback: open model

## 6) ÇEKİRDEK MİMARİ (3 KATMAN)
A) Context Engine
- ripgrep keyword search
- Project Graph: composer.json/package.json analiz, entrypoint heuristics
- Distiller: her N adımda “Repo Memory” özeti (recursive summarizer)
- (Opsiyonel) Light semantic: embedding store (cosine) — MVP’de feature flag

B) Agentic Execution
- Planner → Task steps (max 8)
- Executor: tool calls + edit engine
- Self-healing: validation fail → analyze → fix plan → retry (max 2)
- Checkpoint: değişiklik özetini sun (dosya listesi + diff stats)

C) Cost & Safety Guard
- budget hard stop
- codexflow.ignore (default: .env, node_modules, vendor, storage/logs, *.key)
- spend guard + tool guard

## 7) ANA DOMAIN MODELLER (packages/core)
- Task { id, title, status, createdAt, updatedAt, budgetUsd, spentUsd, modelPlan, modelCode }
- Step { id, taskId, kind(plan|tool|edit|validate), status, startedAt, endedAt, costUsd, tokensIn, tokensOut, logsRef }
- DiffChange { filePath, unifiedDiff, stats }
- ProofCard { taskId, testsStatus, lintStatus, formatStatus, warnings[], logs[] }
- Policy { maxBudgetUsd, allowedTools[], blockedPaths[], proofModeDefault, models{planner,coder,fallback} }

## 8) EXTENSION UX AKIŞI (ZORUNLU)
- Kullanıcı “New Task” girer (örn: “Laravel’de Spatie Permission entegre et”)
- UI: Execution Progress kartları:
  1) Plan (onay bekliyor)
  2) Code/Edit (writing)
  3) Validation (running)
  4) Proof Card (result)
- Bütçe uyarısı: “Tahmini $0.15, devam?” (Spend Guard)
- Diff preview: Apply/Reject/Apply All
- Apply sonrası: Task summary + Dashboard’a sync

## 9) GEREKEN VS CODE COMMANDS (contributes)
- codexflow.openPanel
- codexflow.newTask
- codexflow.explainSelection
- codexflow.regenerateLast
- codexflow.toggleProofMode
- codexflow.setBudget
- codexflow.syncDashboard

## 10) GÜVENLİK
- Default blocked paths + codexflow.ignore override
- Terminal komutları allowlist:
  - php artisan, composer, npm/pnpm, pint, phpunit/pest, wp (varsa), git (read/write ask)
- Secret redaction (loglarda key mask)
- “Ask-before-run” ve “Ask-before-spend” zorunlu

## 11) WORKFLOW RECIPES (MVP — 6 adet)
- Laravel CRUD scaffold + policy + request validation + test + pint
- Laravel test generator (Pest/PHPUnit) + proof
- Laravel refactor service extraction + tests
- WP plugin scaffold + settings page
- WP security checklist fixer (sanitize/escape/nonce) + php -l
- Deploy checklist generator + CI commands

## 12) ÇIKTI / DELIVERABLES (ZORUNLU)
- Çalışan extension:
  - webview panel açılır
  - task oluşturulur
  - diff preview ve apply çalışır
  - proof mode koşar (projede uygun komut varsa)
  - cost panel görünür
- Çalışan dashboard:
  - landing + dashboard route’ları
  - policy ayarı + event listesi + chart placeholder
  - extension’dan /api/events’e örnek event düşer (local dev)

## 13) GELİŞTİRME FAZLARI (SIRAYLA ÜRET)
Part 1: Repo bootstrap (pnpm workspace), packages/core, apps/extension skeleton, commands, panel açma
Part 2: Webview UI (React+Tailwind) + message bridge (extension <-> webview), chat streaming UI
Part 3: LLM abstraction (OpenRouter/LiteLLM), planner/coder routing, streaming client
Part 4: Edit engine (applyUnifiedDiff) + preview + apply/reject + chunk edit
Part 5: Tool interface (files, ripgrep, terminal ask, git ask) + agent executor
Part 6: Budget & safety guard (policy, ignore, hard stop, spend guard)
Part 7: Proof engine (Laravel/WP/Generic validators) + Proof Card UI
Part 8: Dashboard (Next.js) + /api/policy + /api/events + basic charts + auth
Part 9: Sync + docs + examples + tests (minimum) + demo scripts

## 14) KOD KALİTESİ VE TEST
- Unit: edit-engine patch apply tests
- Unit: policy guard path blocking tests
- Integration: mock LLM client + agent run simulation
- E2E (hafif): extension message bridge smoke test (basic)

## 15) UYGULAMA DETAYI: EXTENSION ↔ WEBVIEW BRIDGE
- Webview → Extension: postMessage {type, payload}
- Extension → Webview: postMessage {type, payload}
Event tipleri:
- task.create, task.update, step.update
- diff.preview, diff.apply
- proof.update
- cost.update
- policy.update

## 16) UYGULAMA DETAYI: DASHBOARD SYNC
- Extension config: DASHBOARD_URL, DASHBOARD_TOKEN
- /api/events ingest: TaskSummary + Steps + Proof + Cost
- /api/policy fetch: Policy JSON
- Offline-first: dashboard yoksa local store’a yaz, sonra sync retry

## 17) PROJE STANDARTLARI
- TypeScript strict
- ESLint + Prettier
- Tailwind
- Clean architecture: UI ↔ application ↔ domain ↔ infra ayrımı
- Her pakette README kısa

## 18) ŞİMDİ BAŞLA
- Part 1 ile başla.
- Önce monorepo iskeleti + extension panel açma + komutlar + temel config.
- Her Part sonunda “Manual test steps” yaz (2-5 madde).
- Her Part sonunda “Next Part plan” 5 satırı geçmesin.



# CodexFlow Cursor Rules (rules.md)

Bu repo “CodexFlow: Budget-Guarded + Proof-Driven AI Code Orchestrator” geliştirmek için tasarlandı. Aşağıdaki kurallar **mutlaka** uygulanacak.

---

## 1) Çıktı Formatı ve Çalışma Disiplini

### 1.1 Zorunlu çıktı formatı
- Her yanıt **Part N** formatında olmalı (Part 1, Part 2, …).
- Her Part:
  1) **Amaç**
  2) **Değişiklikler (dosya listesi)**
  3) **Unified diff patch** (applyUnifiedDiff uyumlu)
  4) **Manual test steps**
  5) **Next Part plan** (maks 5 satır)

### 1.2 Diff zorunluluğu
- Her kod değişikliği **sadece unified diff** olarak verilecek.
- “Tam dosyayı baştan yazma” **yasak**. (Örn. 500 satır dosyayı komple yeniden basma.)
- Dosya büyükse: sadece ilgili bölüme “chunk edit” yap.

### 1.3 Tek Part = tek hedef
- Her Part’ta **tek ana hedef**: örn. “extension panel açma”, “LLM client ekleme”.
- Aynı Part’ta farklı modüllere dağılma.

### 1.4 Varsayım yapma
- Belirsiz bir şey varsa **kodda feature flag / TODO** ile güvenli ilerle.
- Uydurma API, uydurma paket sürümü, uydurma dosya yolu yazma.

---

## 2) Mimari Kuralları (Core katmanlar)

### 2.1 Monorepo zorunluluğu
Repo yapısını bozma:
- `apps/extension` (VS Code extension)
- `apps/dashboard` (Next.js web)
- `packages/*` (core engine modülleri)

Yeni işlev eklerken mümkünse `packages/` altında modül oluştur, extension’da sadece “orchestrator + UI bridge” kalsın.

### 2.2 Clean boundaries
- Domain modelleri: `packages/core`
- Provider soyutlama: `packages/llm`
- Agent pipeline: `packages/agent`
- Edit engine: `packages/edit-engine`
- Proof: `packages/proof`
- Telemetry/cost: `packages/telemetry`
- Context/index: `packages/context-engine`

UI (React webview) iş mantığına girmesin; sadece state/render.

---

## 3) Güvenlik Kuralları (Non-negotiable)

### 3.1 Secret & PII
- `.env`, `*.key`, `secrets*` ve benzeri **asla** LLM context’ine eklenmeyecek.
- Varsayılan blocklist:
  - `.env`, `.env.*`
  - `node_modules/`, `vendor/`
  - `storage/`, `storage/logs/`
  - `*.pem`, `*.key`, `id_rsa`, `*.p12`
- `codexflow.ignore` mekanizması eklenince defaultlar otomatik yüklenecek.

### 3.2 Terminal çalıştırma
- Terminal komutu **kullanıcı onayı olmadan** çalıştırılmaz.
- “Ask-before-run” default ON.
- Allowlist dışı komut önerme:
  - `php`, `composer`, `npm/pnpm`, `pint`, `phpunit/pest`, `git`, `wp` (varsa)
- Komutlar loglanır, loglarda secret maskeleme uygulanır.

### 3.3 Ask-before-spend (Usage-based)
- Bütçe varsa ve tahmini maliyet yüksekse kullanıcıya sor:
  - “Bu adım tahmini $X, devam?”
- Hard stop: budget aşılırsa çalışmayı durdur.

---

## 4) Proof-Driven Kuralları (MVP’nin imzası)

### 4.1 Proof Mode default ON
- Bir task tamamlandı sayılmadan önce:
  - En az 1 doğrulama koş (test/lint/format).
- Proof yoksa UI’da “Apply All” **normal** sunulmaz:
  - Sadece “Riskli uygula” (uyarı + ekstra onay) olabilir.

### 4.2 Proof Card zorunlu alanlar
- Tests: passed/failed/skipped (+ sebep)
- Lint/Format: ok/failed/skipped (+ sebep)
- Logs: komut + exit code + kısa özet

### 4.3 Validator seçimi
- Laravel:
  - `pint` + `php artisan test` (varsa)
- WordPress:
  - `php -l` ve mümkünse `wp plugin activate` (opsiyonel)
- Generic:
  - `npm test` / `npm run lint` (varsa)

“Var/yok” kontrolü yapılmadan komut uydurma.

---

## 5) Maliyet Yönetimi (Budget/Cost Guard)

### 5.1 Telemetry zorunlu
Her task/step için:
- tokens_in / tokens_out
- cost_usd
- latency_ms
- model adı

### 5.2 Distiller (Repo Memory)
- Uzayan tasklarda context’i şişirme; düzenli “Repo Memory” özeti üret.
- Bir sonraki adımda önce Repo Memory’yi kullan.

### 5.3 Loop guard
- Aynı hata 2 kez tekrarlandıysa:
  - planı küçült
  - alternatif yaklaşım dene
  - hâlâ olmuyorsa dur + net raporla

---

## 6) Kod Kalitesi Standartları

### 6.1 TypeScript / Node
- `strict: true`
- `noImplicitAny` kapatma yok
- Hata yönetimi: try/catch + typed errors
- Async: abort/cancel (streaming stop) için `AbortController`

### 6.2 React (webview & dashboard)
- Presentational vs container ayrımı
- Global state minimal (zustand/valtio gibi ek bağımlılık MVP’de gerekmedikçe ekleme)
- Tailwind: tutarlı spacing/typography

### 6.3 Test
Minimum test:
- edit-engine: patch apply tests
- policy guard: blocked path tests
- agent: mock LLM + tool simulation smoke test

---

## 7) VS Code Extension Kuralları

### 7.1 Webview Bridge
- Tüm mesaj tipleri `type` + `payload` şemasında.
- Message type’ları tek bir yerde enum/union type olarak tanımlanır.
- UI state, extension state’den event’lerle güncellenir (task.update, step.update, diff.preview, proof.update, cost.update).

### 7.2 Dosya işlemleri
- `vscode.workspace.fs` kullan.
- Büyük dosyalarda tam içerik yerine “targeted ranges/chunks”.

### 7.3 Git işlemleri
- MVP’de minimal:
  - status, diff, add, commit
- Write işlemleri için onay şart.

---

## 8) Dashboard (Merkez Üs) Kuralları

### 8.1 MVP Dashboard sınırı
- Landing + Auth + 3 ekran:
  - Usage/Cost
  - Task History
  - Policy (budget, models, tools)
- “Fancy” admin/enterprise özellikleri MVP’yi geciktirmesin.

### 8.2 API sözleşmesi
- `/api/events` ingest (TaskSummary + Steps + Proof + Cost)
- `/api/policy` fetch (Policy JSON)
- Offline-first: event’ler local queue, sonra sync retry.

---

## 9) Bağımlılık Politikası
- Yeni kütüphane eklemeden önce:
  - “Neden gerekli?” + “Alternatif” + “Bundle/maintenance etkisi” yaz.
- MVP’de minimum bağımlılık.
- Semantik arama/Vector DB gibi ağır parçalar feature flag ile.

---

## 10) Dokümantasyon
Her önemli modül eklenince:
- `docs/architecture.md` güncelle
- `docs/security.md` güncelle
- `docs/workflows.md` (Laravel/WP recipes)

---

## 11) Done / Definition of Done
Bir Part “Done” sayılması için:
- Derlenebilir (TS compile)
- En az 2–5 manual test step yazıldı
- Güvenlik kuralları ihlal edilmedi
- Değişiklikler diff ile verildi
- Next Part plan verildi

---

## 12) Yasaklar (Hard NO)
- Dosyaları komple yeniden yazmak
- Secret dosyaları okumak / loglamak
- Kullanıcı onayı olmadan terminal çalıştırmak
- Bütçe limiti varken “devam edip yakmak”
- “Test geçti” demek ama test koşmamak (kanıtsız iddia)





{
  "version": 1,
  "project": "CodexFlow.dev",
  "goal": "Build a Budget-Guarded + Proof-Driven AI Code Orchestrator as a VS Code extension + web HQ dashboard (monorepo).",
  "output_rules": {
    "require_parts": true,
    "require_unified_diff_only": true,
    "no_full_file_rewrites": true,
    "one_main_goal_per_part": true,
    "end_each_part_with": ["manual_test_steps", "next_part_plan_max_5_lines"]
  },
  "safety": {
    "ask_before_run_terminal": true,
    "ask_before_git_write": true,
    "ask_before_spend": true,
    "blocked_paths_default": [
      ".env",
      ".env.*",
      "node_modules/**",
      "vendor/**",
      "storage/**",
      "storage/logs/**",
      "**/*.pem",
      "**/*.key",
      "**/*.p12",
      "**/id_rsa",
      "**/id_ed25519",
      "**/secrets*"
    ],
    "never_send_to_llm": [
      ".env",
      ".env.*",
      "**/*.pem",
      "**/*.key",
      "**/id_rsa",
      "**/id_ed25519",
      "**/secrets*"
    ],
    "log_redaction": {
      "enabled": true,
      "patterns": [
        {
          "name": "generic_api_key",
          "regex": "(?i)(api[_-]?key\\s*[:=]\\s*)([A-Za-z0-9_\\-]{12,})",
          "replace": "$1***REDACTED***"
        },
        {
          "name": "bearer_token",
          "regex": "(?i)(authorization\\s*:\\s*bearer\\s+)([A-Za-z0-9\\-\\._~\\+\\/]+=*)",
          "replace": "$1***REDACTED***"
        },
        {
          "name": "openai_key",
          "regex": "(sk-[A-Za-z0-9]{10,})",
          "replace": "***REDACTED***"
        },
        {
          "name": "anthropic_key",
          "regex": "(?i)(anthropic[_-]?api[_-]?key\\s*[:=]\\s*)([A-Za-z0-9_\\-]{12,})",
          "replace": "$1***REDACTED***"
        }
      ]
    }
  },
  "architecture": {
    "monorepo": true,
    "workspace_manager": "pnpm",
    "folders": {
      "apps/extension": "VS Code extension (Node + TypeScript)",
      "apps/dashboard": "Next.js web HQ (landing + dashboard)",
      "packages/core": "domain models, shared types, events",
      "packages/llm": "provider abstraction (OpenRouter/LiteLLM)",
      "packages/context-engine": "hybrid search, project graph, distiller",
      "packages/agent": "planner/coder pipeline, tools, self-heal loop",
      "packages/edit-engine": "applyUnifiedDiff + preview + chunk edit",
      "packages/proof": "validators + ProofCard model",
      "packages/telemetry": "cost/tokens/latency + local store",
      "packages/ui-webview": "React webview UI (Chat + Agent + Proof + Diff)"
    },
    "boundaries": [
      "UI must not contain business logic; only state/render.",
      "Domain models live in packages/core only.",
      "Extension is orchestrator + bridge; heavy logic in packages/."
    ]
  },
  "mvp_contract": {
    "must_have": [
      "Agent: Task→Plan→Execute→Validate→Report (max 8 steps)",
      "Edit Engine: applyUnifiedDiff + preview + apply/reject + chunk edit",
      "Proof Mode default ON: validators run and produce Proof Card",
      "Budget guard: task budget + hard stop + spend warnings",
      "Telemetry: tokens/cost/latency per step",
      "Terminal: allowlist + ask-before-run",
      "Dashboard minimal: /api/events ingest, /api/policy fetch, basic charts"
    ],
    "explicitly_not_in_mvp": [
      "Advanced IDE refactor (rename symbol/import auto-fix)",
      "Full vector DB infra (feature-flag only)",
      "Enterprise SSO/RBAC/Audit full suite"
    ]
  },
  "proof_driven": {
    "default_on": true,
    "apply_all_behavior": {
      "if_proof_success": "normal_apply_all",
      "if_proof_failed_or_missing": "risk_apply_requires_extra_confirm"
    },
    "validators": {
      "laravel": {
        "detect": ["artisan", "composer.json"],
        "commands": ["php artisan test", "vendor/bin/pint"],
        "notes": "Run only if available; otherwise mark as skipped with reason."
      },
      "wordpress": {
        "detect": ["wp-content", "*.php"],
        "commands": ["php -l <changed_files>"],
        "optional_commands": ["wp plugin activate <plugin>"],
        "notes": "wp-cli is optional; never assume it exists."
      },
      "generic_node": {
        "detect": ["package.json"],
        "commands": ["npm test", "npm run lint"],
        "notes": "Run only if scripts exist."
      }
    }
  },
  "terminal": {
    "allowlist_prefixes": [
      "php",
      "composer",
      "npm",
      "pnpm",
      "yarn",
      "git",
      "wp",
      "vendor/bin/pint",
      "vendor/bin/phpunit",
      "vendor/bin/pest"
    ],
    "denylist_prefixes": ["rm", "sudo", "dd", "mkfs", "shutdown", "reboot", "curl | sh", "powershell -enc"]
  },
  "bridge_protocol": {
    "message_shape": { "type": "string", "payload": "object" },
    "types": [
      "task.create",
      "task.update",
      "step.update",
      "diff.preview",
      "diff.apply",
      "proof.update",
      "cost.update",
      "policy.update",
      "chat.stream",
      "chat.stop"
    ],
    "single_source_of_truth": "packages/core/src/bridge.ts"
  },
  "quality": {
    "typescript": { "strict": true },
    "testing_minimum": [
      "edit-engine: apply patch tests",
      "safety: blocked path tests",
      "agent: mock llm + tool simulation smoke test"
    ],
    "dependency_policy": "Minimize deps; justify each new dependency."
  }
}
