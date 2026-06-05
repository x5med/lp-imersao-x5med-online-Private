# Landing Page — Imersão X5 Med Online

> **Single Source of Truth** — Lido por todas as IAs (Claude, Gemini, Codex, Qwen).

## Sobre o Projeto

Landing page de alta conversão para a **Imersão X5 Med Online**, evento de educação empresarial para médicos promovido pela **X5 MED**.

**Objetivo:** Converter médicos interessados em crescimento empresarial a se inscreverem na imersão online ao vivo (taxa simbólica de R$297 individual / R$497 duplo).

**Evento:** Domingo, 14 de junho de 2026 | 100% Online e Ao Vivo (1 dia intensivo)

## Sobre a X5 MED

- Empresa de educação empresarial focada exclusivamente em médicos
- Fundada por Dr. Vital Araújo
- Especialistas: Dr. Vital Araújo, Dr. Fábio Rodrigues, Dra. Patrícia Santiago, Patrício Darvisson
- Método baseado em 5 pilares: Mentalidade, Atração, Conversão, Expansão, Técnico
- Edições presenciais custaram R$6.000–R$8.000; versão online por taxa simbólica

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build**: Vite 6
- **CSS**: Tailwind CSS v4
- **Animações**: Motion (Framer Motion)
- **Ícones**: Lucide React
- **Fontes**: Montserrat (headings) + Poppins (body)

## Paleta de Cores (Brand)

- **Laranja**: `#ED8C00` (principal), `#FF9700` (light), `#C97701` (dark)
- **Verde**: `#00b210` (CTAs), `#00e23c` (light)
- **Fundo escuro**: `#0a0a0a` (darker), `#111111` (dark)
- **Texto**: Branco `#ffffff`, cinzas para secundário

## Estrutura do Projeto

```
/
├── AGENTS.md           # Fonte única de verdade (este arquivo)
├── CLAUDE.md           # Instruções específicas Claude
├── GEMINI.md           # Instruções Gemini
├── CODEX.md            # Instruções Codex
├── QWEN.md             # Instruções Qwen
├── changelog.md        # Histórico de mudanças
├── Copy Magnus.md      # Copy completa da LP (referência)
├── apresentacao_x5med.pdf  # Apresentação atual do evento
│
├── index.html          # Entry point
├── package.json        # Dependências
├── vite.config.ts      # Config Vite
├── tsconfig.json       # Config TypeScript
├── src/
│   ├── main.tsx        # Bootstrap React
│   ├── App.tsx         # Componente principal (toda a LP)
│   └── index.css       # Estilos globais + Tailwind theme
│
├── assets/             # Imagens, logos, fotos dos especialistas
│
├── benchmarks/         # Screenshots de referência (concorrentes)
│   ├── acelerador-desktop.png
│   ├── acelerador-mobile.png
│   ├── medico-empresario-ruppi.png
│   └── x5med-atual.png
│
├── .claude/skills/     # Skills Antigravity copiadas (10 skills)
├── .mcp.json           # MCP Stitch configurado
└── .env                # API keys (gitignored)
```

## Seções da Landing Page (ordem atual)

1. **TopBar** — Data, formato, countdown regressivo
2. **StickyBar** — CTA fixo no topo (aparece após scroll)
3. **Hero** — Headline + bullets + CTA de reserva + WhatsApp + countdown badge
4. **Identification** — Dor de identidade (médico ≠ empresário)
5. **Pain** — Agenda cheia ≠ clínica saudável
6. **Solution** — Apresentação da imersão como solução
7. **Pillars** — 5 pilares do método X5 Med (glassmorphism cards + orbs)
8. **WhatYouWillLearn** — Cards com aprendizados práticos
9. **TargetAudience** — Para quem é / Para quem não é (qualifica antes da oferta)
10. **Authority** — Especialistas com fotos e descrições
11. **SocialProof** — Depoimentos (vídeos/prints) — confiança antes da oferta
12. **BeliefBreaking** — Quebra de crença ("construir melhor, não atender mais")
13. **DecisionBridge** — Ponte de decisão com próximo passo e CTA para formulário
14. **Candidatura** — Formulário de captura de leads para confirmação pelo time comercial
15. **Bonus** — Bônus VIP de implementação (layout split screen)
16. **FAQ** — Perguntas frequentes (accordion) — objeções de valor, processo e participação
17. **Footer** — CTA final + copyright

## Copy de Referência

O arquivo `Copy Magnus.md` contém a copy completa já otimizada para conversão, escrita pelo agente Magnus (GPT customizado para copywriting). **Toda a copy da LP deve seguir esse arquivo como referência.**

## Benchmarks Visuais

- **Acelerador Empresarial** (desktop + mobile): Referência de LP de educação empresarial genérica. Bom layout, boa estrutura de conversão.
- **Médico Empresário (Thiago Ruppi)**: Concorrente direto. LP escura, hero com foto do especialista, foco em médicos.
- **X5 MED atual**: Nossa LP existente (incompleta, feita às pressas). Base para melhorar.

## Diretrizes de Design

- **Tom visual**: Premium, escuro, sofisticado — médicos são público exigente
- **Inspiração**: Benchmarks acima + elite-web-designer skill (glassmorphism, micro-animações)
- **Mobile-first**: Responsivo, performance é prioridade
- **Conversão**: CTAs claros (RESERVAR MINHA VAGA), caminho LP → formulário → time comercial
- **Fechamento por time comercial**: LP captura leads qualificados via formulário (Supabase); o valor da condição especial é liberado no contato humano
- **Imagens**: Fotos reais dos especialistas + 19 depoimentos em assets/ (zero placeholders)
- **Versão checkout direto preservada** na branch `archive/checkout-direto` para referência histórica

## Skills Disponíveis (Antigravity)

Skills que podem ser ativadas neste projeto:

| Skill | Uso |
|-------|-----|
| **elite-web-designer** | Design premium, glassmorphism, micro-animações, tipografia |
| **marketing/copywriting** | Refinamento de copy, headlines, CTAs |
| **marketing/page-cro** | Análise de conversão da página |
| **marketing/seo-audit** | SEO técnico e on-page |
| **marketing/product-marketing-context** | Contexto de produto (base para outras skills) |
| **stitch-design** | Geração de design via Google Stitch (MCP) |
| **spline-3d** | Assets 3D interativos (opcional, hero) |
| **codex-orchestrator** | Code review via Codex/GPT-5 |

## Regras para IAs

1. **Leia AGENTS.md antes de começar** qualquer tarefa
2. **Use `Copy Magnus.md` como referência** para todo o texto da LP
3. **Registre mudanças** no `changelog.md`
4. **Mantenha este arquivo atualizado** ao fazer mudanças estruturais
5. **Não quebre o que funciona** — teste antes de refatorar
6. **Mobile-first** — sempre verificar responsividade
7. **Performance** — otimizar imagens, lazy loading, Core Web Vitals
8. **Acessibilidade** — semântica HTML, contraste, alt texts

## Integração Supabase

Os leads do formulário "Reservar minha vaga" são persistidos no projeto Supabase **Leads Magnet** (`azxmienpmmkddmvyujbm`), o mesmo usado pelo EndoMax, **em tabela separada**.

- **Tabela**: `public.imersao_x5med_leads`
- **Campos**: `nome, email, whatsapp, instagram?, faixa_faturamento, utm_source, utm_medium, utm_campaign, utm_content, utm_term, ref, created_at`
- **RLS**: habilitada. Policy `leads_insert_policy` permite INSERT para role `anon` com validação de formato (nome 2-200, regex de email, whatsapp só dígitos 8-20). Sem policies de SELECT/UPDATE/DELETE — só `service_role` lê os leads.
- **Cliente**: `src/lib/supabase.ts`. Credenciais em `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- **UTM tracking**: `src/lib/utm.ts` — first-touch attribution em sessionStorage.
- **Migrations**: `supabase/migrations/` (aplicadas via `supabase db push` com o access token do CLI).
- **Dashboard**: https://supabase.com/dashboard/project/azxmienpmmkddmvyujbm/editor → tabela `imersao_x5med_leads`
- **Gotcha documentado**: nunca usar `.select()` após `.insert()` no supabase-js — exigiria SELECT policy, que não existe para anon. Apenas `.insert(...)` funciona.

## Deploy (Vercel)

- **Team**: `magnus-engines` · **Projeto**: `lp-imersao-x5med-online` · **Domínio**: `imersao.x5med.cloud`
- **Env vars configuradas** (Production, Preview, Development): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Gotcha**: como `.env` está no `.gitignore`, qualquer deploy precisa das env vars configuradas no Vercel — sem elas, o bundle inicializa o cliente Supabase como `null` e o form responde "Formulário indisponível no momento".
- **Redeploy**: `vercel --prod` (CLI já linkado via `.vercel/` local, também gitignored).

## Tarefas Pendentes

- [x] Organizar documentação do projeto
- [x] Extrair LP do AI Studio como base
- [x] Corrigir CTAs para seguir Copy Magnus (preço no botão)
- [x] Adicionar WhatsApp CTA secundário no Hero
- [x] Adicionar contador regressivo para o evento
- [x] Adicionar sticky CTA bar para mobile
- [x] Corrigir lang="pt-BR" e meta tags básicas (OG, description)
- [x] Glassmorphism nos cards (Pilares, Aprendizados, Oferta, FAQ)
- [x] Scroll-reveal animations em todas as seções
- [x] Melhorar botões CTA (glow/sombra premium)
- [x] Reordenar seções para melhor fluxo de conversão
- [x] Limpar dependências desnecessárias do AI Studio
- [x] Substituir imagens placeholder por fotos reais dos especialistas
- [x] Adicionar depoimentos reais (19 prints WhatsApp em galeria masonry)
- [x] Remover última imagem stock (Pain section → card glassmorphism)
- [x] Revisão visual completa via Playwright (desktop 1440px + mobile 390px)
- [x] Pivot: trocar checkout direto por formulário de captura de leads (time comercial fecha)
- [x] Integrar Supabase para persistência dos leads (tabela `imersao_x5med_leads`)
- [x] Tightening da RLS policy com validação de formato
- [x] Adicionar logo X5 MED real
- [ ] Expandir bios dos especialistas com credenciais
- [ ] Anti-spam no formulário (Cloudflare Turnstile / hCaptcha invisível)
- [ ] Webhook/notificação quando chegar novo lead (Slack, e-mail, WhatsApp)
- [ ] SEO completo (schema markup, sitemap)
- [ ] Testar e otimizar performance (Lighthouse)
- [x] Deploy no Vercel (team `magnus-engines`, projeto `lp-imersao-x5med-online`, domínio `imersao.x5med.cloud`)
- [x] Meta Pixel instalado (ID `4697356290547354`): PageView no `<head>` + `CompleteRegistration` após submit do form
- [ ] Meta Conversions API (server-side com deduplicação) para recuperar conversões bloqueadas por ad-blockers
- [ ] Pixel/tag do Google Ads (quando campanha for lançada)

---
*Atualizado: 2026-04-14*
