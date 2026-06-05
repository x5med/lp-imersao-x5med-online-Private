## [2026-06-03b] - Codex (Hero reorganizado)

### Changed
- Hero reorganizado em layout editorial: cabeçalho superior com marca/dados do evento, copy e CTAs em coluna principal, cards de benefícios compactos e painel visual dedicado para os especialistas.
- Hero ganhou variação inspirada na referência Behance de página de vendas para evento: composição em palco, imagem dos especialistas como cenário, headline centralizada, CTA de foco e faixa inferior de benefícios.
- Ajustada a profundidade da Hero para reduzir sobreposição: headline, subheadline, CTAs e chips ficam em área limpa, com a foto dos especialistas posicionada abaixo como palco visual.
- Hero simplificada para formato amplo sem moldura/card: imagem dos especialistas ampliada como elemento principal, copy menor abaixo da imagem e composição mais aberta.
- Adicionado efeito global de glow de fogo com camada fixa não-interativa, usando gradientes quentes, blend mode e animação sutil respeitando `prefers-reduced-motion`.
- Background base da página ajustado para preto puro (`#000`) no `body` e wrapper principal.
- Popups/overlays refinados para o novo fundo preto: sticky CTA em pílula flutuante, formulário com estados em glass escuro premium e FAQ expandido com painel mais elegante.
- Fundo da Hero ajustado para preto real, com glow laranja reduzido para não tingir a área principal.

---

## [2026-06-03] - Codex (Revisão CRO/UI — coerência comercial e fluxo)

### Changed
- Metadados (`title`, `description`, `og:description`) alinhados ao pivot de captura por formulário, removendo promessa de preço direto nos previews sociais/SEO.
- Hero atualizado com logo real da X5 Med, CTA primário de reserva e CTA secundário de WhatsApp com mensagem pré-preenchida.
- Hero refinado visualmente com hierarquia mais limpa: marca e badge mais discretos, chips menos arredondados, headline com maior presença editorial, CTAs em bloco estável e foto dos especialistas ancorada em moldura com gradiente.
- Hero reequilibrado com grid mais harmonioso, imagem dos especialistas mais presente, CTAs proporcionais e ambientação laranja mais integrada ao card.
- `DecisionBridge` reescrito e reposicionado antes do formulário, criando um próximo passo mais claro após prova/quebra de crença.
- Formulário de candidatura reduzido: campo Instagram removido da interface inicial e faturamento ganhou microcopy explicando o uso da informação.
- FAQ ampliado com objeções de valor liberado pelo time, taxa simbólica e possibilidade de aprofundamento/mentoria.
- Visual refinado com menos glow/orbs, raio menor em cards críticos, WhatsApp menos neon e `content-visibility` em seções pesadas abaixo da dobra.

### Performance / Accessibility
- Imagens principais receberam `width`, `height`, `decoding="async"` e lazy loading onde apropriado para reduzir CLS e custo de renderização.
- Mantidos `prefers-reduced-motion`, foco visível e chunking manual já presente em `vite.config.ts`.

### Notes
- Não foi feita conversão real para WebP/AVIF porque não há `cwebp`, ImageMagick ou `sharp` instalado localmente. Débito recomendado: gerar versões responsivas das imagens de hero, ingressos e depoimentos.

---

## [2026-04-23b] - Claude (Meta Pixel — base + CompleteRegistration)

### Added
- **Meta Pixel** instalado no `<head>` do `index.html` (ID `4697356290547354`) com `PageView` disparado em toda visita e `<noscript>` fallback para usuários sem JS
- **Evento `CompleteRegistration`** disparado em `src/App.tsx` dentro do `handleSubmit` da `<Candidatura />`, logo após o insert bem-sucedido no Supabase — como a LP é SPA sem página de obrigado separada, o evento dispara quando o estado vira `success`
- Parâmetros do evento: `content_name: "Imersão X5 Med Online"`, `status: true`, `value: 297`, `currency: "BRL"` (ajuda o Meta a otimizar campanhas por valor)
- Tipagem `window.fbq` via `declare global` para não quebrar o build TS

### Notes
- Validar o disparo com a extensão **Meta Pixel Helper** (Chrome) e na aba **"Eventos de teste"** do Events Manager
- Recomendado habilitar **"Correspondência Avançada Automática"** no Events Manager (detecta email/telefone do form e melhora a taxa de match das conversões)
- Próximo passo (débito conhecido): **Conversions API** server-side com deduplicação por `eventID` para não perder conversões de quem usa bloqueador de anúncios — exige webhook ou edge function lendo do Supabase

---

## [2026-04-23] - Claude (Evento reduzido para 1 dia — 14/jun)

### Changed
- Evento reconfigurado de **2 dias (13 e 14 jun)** para **1 dia intensivo (domingo, 14 jun)** — sábado 13/jun tem jogo da Seleção Brasileira na Copa, decidido deslocar tudo para o domingo
- Copy reposicionada como "1 dia intensivo" / "domingo, 14 de junho" — enquadramento neutro, sem comparação com a versão anterior de 2 dias (evita sensação de "encolhimento")
- `src/App.tsx`: `EVENT_DATE` → `2026-06-14T08:00:00-03:00`; TopBar, StickyBar, Hero (alt do ingresso), Solution ("Em 1 dia intensivo"), microcopy da Offer, FAQ e Footer
- `index.html`: meta description e og:description atualizados
- `Copy Magnus.md`: barra superior, subheadline do Hero, bloco Solução, Oferta 1, FAQ e microcopy final
- `AGENTS.md`: referência do evento

### Pendente / Débito conhecido
- **Imagem `sem_qr_code_202604091411.jpeg`** (usada em `<Identification />` como ingresso) ainda mostra "DATA: 25 E 26 DE ABRIL" — está desatualizada desde a troca de data anterior (abril → junho). Considerar regenerar com "14 DE JUNHO" ou substituir por asset atualizado

---

## [2026-04-14f] - Claude (Deploy Vercel + env vars)

### Fixed
- **Form "Formulário indisponível no momento"** em produção: bundle no Vercel não tinha `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` (só existiam no `.env` local, gitignored)
- Env vars adicionadas ao projeto `magnus-engines/lp-imersao-x5med-online` para Production, Preview e Development
- Redeploy em produção (`vercel --prod`) — form funcional em `imersao.x5med.cloud`

### Changed
- `.gitignore`: `.vercel` e `.env*.local` adicionados automaticamente pelo `vercel link`
- `AGENTS.md`: seção "Deploy (Vercel)" documentando projeto, env vars e gotcha do build sem credenciais

---

## [2026-04-14e] - Claude (Data do evento atualizada)

### Changed
- Data do evento alterada de **25 e 26 de abril** para **13 e 14 de junho de 2026**
- `src/App.tsx`: `EVENT_DATE` (countdown) → `2026-06-13T08:00:00-03:00`; textos em TopBar, StickyBar, Hero, alt da imagem de ingressos, Offer e Footer
- `index.html`: meta description atualizada
- `AGENTS.md`: referência do evento atualizada
- `Copy Magnus.md`: referência histórica atualizada

---

## [2026-04-14d] - Claude (Fase 14 — Tightening de RLS)

### Security
- Policy `leads_insert_policy` apertada em resposta a warning do Supabase linter:
  - `to public` → `to anon` (explícito, só o role anônimo do Supabase)
  - `with check (true)` → validações de tamanho/formato (nome 2-200, email com regex, whatsapp só dígitos 8-20, faixa_faturamento 1-50, instagram opcional ≤100)
- Testes: submissão válida → 201 ✓ | nome vazio → 401 ✓ | email malformado → 401 ✓ | whatsapp com letras → 401 ✓
- **Nota:** warning persistente "always true" no linter é *falso positivo* neste contexto — form público de lead precisa aceitar qualquer submissão válida. Anti-spam real deve vir em outra camada (Turnstile/hCaptcha/edge function com rate limit).

---

## [2026-04-14c] - Claude (Fase 13 — Supabase aplicada e testada E2E)

### Applied
- Migration `20260414_create_imersao_x5med_leads.sql` aplicada no projeto **Leads Magnet** (`azxmienpmmkddmvyujbm`) via Supabase CLI com novo access token
- Policy final: `leads_insert_policy` (INSERT / public / `with check (true)`)
- Validado E2E: insert via anon JWT + `@supabase/supabase-js` retorna **201 Created** e persiste o lead
- Tabela limpa (sem linhas de teste)

### Fixed
- **Gotcha descoberto:** usar `Prefer: return=representation` no insert REST requer SELECT, que a RLS bloqueia para anon (não há policy de SELECT), fazendo o insert falhar com mensagem confusa "new row violates row-level security policy". Solução: o frontend usa supabase-js SEM `.select()` encadeado, portanto não pede a linha de volta e o insert funciona.

---

## [2026-04-14b] - Claude (Fase 12 — Integração Supabase)

### Added
- **Supabase integrado** no formulário de reserva de vaga (projeto "Leads Magnet" — `azxmienpmmkddmvyujbm`, mesmo usado pelo EndoMax, **tabela separada**)
- Nova tabela `public.imersao_x5med_leads` com RLS habilitado e policy de insert para `anon`
- Migration SQL em `supabase/migrations/20260414_create_imersao_x5med_leads.sql`
- `src/lib/supabase.ts` — cliente Supabase (padrão do EndoMax)
- `src/lib/utm.ts` — captura de UTM params com first-touch attribution em sessionStorage
- `src/vite-env.d.ts` — tipos de `import.meta.env`
- Tratamento de erro no form com mensagem visível ao usuário
- `.env` com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

### Dependencies
- `@supabase/supabase-js` adicionado

### Schema da tabela `imersao_x5med_leads`
- `id` (uuid), `nome`, `email`, `whatsapp`, `instagram` (nullable), `faixa_faturamento`
- UTMs: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `ref`
- `created_at` (default now())
- Índices em `created_at desc`, `email`, `utm_source`

---

## [2026-04-14] - Claude (Fase 11 — Pivot Checkout → Candidatura)

### Changed
- **Pivot estratégico**: LP deixa de fechar venda direta (R$297 / R$497) e passa a capturar leads qualificados para o time comercial
- `CTA_LINK` alterado de `#oferta` para `#candidatura`
- **Seção Offer removida**, substituída por nova seção `Candidatura` com formulário completo (nome, e-mail, WhatsApp, especialidade, faturamento, desafio atual)
- Submit tenta POST `/api/candidatura` (endpoint a configurar); fallback abre WhatsApp pré-preenchido
- Estado de sucesso com mensagem "contato em até 24h"
- **CTAs atualizados** em StickyBar, Hero, WhatYouWillLearn e Footer: "QUERO ME CANDIDATAR"
- **FAQ**: pergunta sobre valor abaixo do presencial substituída por "Como funciona a candidatura?"; referência a R$497 removida
- **Footer**: CTA duplo de preços substituído por "QUERO ME CANDIDATAR" + "FALAR COM O TIME"

### Preserved
- Versão anterior (checkout direto) salva na branch `archive/checkout-direto` para referência histórica

---

## [2026-04-09] - Claude (Fase 10 — Shimmer Text Effect)

### Added
- **ShimmerText component**: Efeito de brilho branco deslizante sobre texto laranja (delay 0.3s, duration 2.5s, repeatDelay 0.8s)
- Aplicado em 5 pontos estratégicos: Hero headline, Identification, Solution/Pilares, Offer ancoragem, Footer CTA

---

## [2026-04-09] - Claude (Fase 9 — Cleanup Bônus)

### Removed
- **Bonus section**: Removido botão CTA "QUERO GARANTIR MINHA VAGA AGORA" — redundante com os CTAs da Offer

---

## [2026-04-09] - Claude (Fase 8 — Hero Copy Update)

### Changed
- **Hero headline**: Atualizada de "Sua clínica pode faturar mais sem exigir mais horas da sua vida" para "Sua clínica pode crescer mais sem consumir ainda mais da sua vida e do seu tempo"

---

## [2026-04-09] - Claude (Fase 7 — Hero Mobile: Foto Especialistas + Fundo Preto)

### Added
- **Hero (mobile)**: Foto dos 4 especialistas agora visível no mobile/tablet (antes era `hidden lg:flex`)
- Imagem com fade gradiente top/bottom e animação de entrada suave

### Changed
- **Hero card**: Fundo alterado de `bg-brand-darker` (#0a0a0a) para `bg-black` (#000) — melhor integração da foto e mais profundidade
- **Hero (mobile)**: Removido drop-shadow laranja da foto para visual mais limpo

---

## [2026-04-09] - Claude (Fase 6 — TopBar Slim + Hero Otimizado)

### Changed
- **TopBar**: Reduzida altura (~50%) — padding `py-3` → `py-1.5`, countdown compactado (boxes menores, fontes menores), layout sempre inline
- **Hero**: Otimizado para CTA na primeira dobra — removido `min-h-[90vh]`, paddings reduzidos, textos compactados
- **Hero**: Foto dos palestrantes com fade suave top/bottom + glow laranja sutil, animação de entrada vertical
- **Hero**: Inversão de cores — card interno preto (`#0a0a0a`) para integrar com fundo da foto, section externa cinza (`#111111`) para contraste
- **Hero**: Imagem escondida no mobile (`hidden lg:flex`) para manter CTA visível na primeira dobra
- **CountdownUnit**: Reduzido tamanho geral (padding, min-width, fonte)

---

## [2026-04-09] - Claude (Fase 5 — UX Polish + Carrossel Depoimentos)

### Changed
- **Pain Section**: Substituído card glassmorphism de texto por imagem real dos ingressos dourados (`sem_qr_code_202604091411.jpeg`) com glow e hover effects
- **Pain Section (mobile)**: Imagem dos ingressos reduzida para `max-w-[240px]` no mobile para melhor proporção
- **Authority**: Aumentada proporção dos cards de `aspect-[3/4]` para `aspect-[2/3]` para não cortar cabeças
- **Authority**: Adicionado `object-top` nas fotos + posição customizada para foto do Dr. Vital (`center 25%`)
- **SocialProof**: Galeria masonry substituída por carrossel horizontal (scroll lateral) com setas de navegação
- **SocialProof**: Auto-scroll contínuo (0.5px/frame), acelera no hover das setas (3px/frame), pula 350px no clique
- **SocialProof**: Pausa automática ao tocar/arrastar o track + loop infinito ao chegar no final

### Added
- Imagem dos ingressos X5 Med (`assets/sem_qr_code_202604091411.jpeg`)
- Dependência `playwright` (dev) para testes visuais

---

## [2026-04-09] - Gemini (Fase 4 — Refinamento Design Elite)

### Added
- **Glassmorphism V2**: Implementada classe `.glass-card` com `backdrop-blur(16px)` e bordas internas refinadas no `index.css`.
- **Shimmer Borders**: Efeito de borda animada (conic-gradient) `.shimmer-border` para o card "Mais Recomendado".
- **Ambient Orbs**: Injeção de orbes de luz enevoados no background para dar profundidade ao vidro.
- **Fading Lines**: Substituídas bordas sólidas por gradientes lineares suaves entre seções.
- **Micro-interações**: Adicionado efeito float animado no logotipo "X5" do Hero.

### Changed
- **Botões Premium**: Centralizados em classes utility (`btn-primary`, `btn-secondary`, `btn-whatsapp`) com inner-shadows táteis.
- **Section Bonus**: Reorganizado o layout para "Split Screen" — copy/botão na esquerda e card de bônus na direita.
- **CSS Architecture**: Limpeza e centralização de tokens de estilização no `index.css`.

### Removed
- **Section Urgency**: Removida por redundância com o Footer, melhorando o tempo de scroll e foco comercial.

---

## [2026-04-09] - Claude (Fase 3 — Imagens Reais + Revisão Visual)

### Changed
- **Hero**: Substituído placeholder Unsplash pela foto real dos 4 palestrantes juntos (`4 palestrantes juntos.png`)
- **Authority**: Substituídas 4 fotos Unsplash pelas fotos profissionais reais de Dr. Vital, Dr. Fábio, Dra. Patrícia e Patrício
- **Authority**: Removido efeito `grayscale opacity-60` — fotos reais precisam ser visíveis, não escondidas
- **SocialProof**: Substituídos 3 placeholders de vídeo por galeria masonry com 19 prints reais de depoimentos de médicos no WhatsApp
- **Pain**: Substituída última imagem stock (Unsplash) por card glassmorphism com copy de impacto
- **WhatYouWillLearn**: Reduzido gap excessivo antes do CTA (mt-16 → mt-10)
- Adicionado `loading="lazy"` em todas as imagens para performance
- Removido import não utilizado (`Play` do lucide-react)
- Zero imagens Unsplash restantes na LP

### Revisão Visual (Playwright)
- Verificada em desktop (1440px) e mobile (390px)
- Todas as seções renderizam corretamente
- Sem overflow horizontal no mobile
- CTAs visíveis e funcionais em ambos os viewports

---

## [2026-04-09] - Claude (Fase 1 + 2)

### Added
- Contador regressivo (countdown) no TopBar com dias:horas:min:seg até o evento
- Sticky CTA bar fixa no topo que aparece após scroll (mobile + desktop)
- Botão WhatsApp CTA secundário no Hero com ícone e cor nativa
- Bullets de benefícios no Hero (Copy Magnus)
- Microcopy "Taxa simbólica de comprometimento" no Hero
- Componente `Reveal` para scroll-reveal animations (fade-up via whileInView)
- Glassmorphism em todos os cards (backdrop-blur, sombras em camadas, hover glow)
- Meta tags: OG tags, meta description, lang="pt-BR"
- Variante `whatsapp` no componente Button
- Skills Antigravity copiadas para `.claude/skills/` (10 skills de marketing/design)
- MCP Stitch configurado (`.mcp.json` com API key)

### Changed
- **CTAs corrigidos** para seguir Copy Magnus — todos com preço visível: "GARANTIR MINHA VAGA POR R$297", "GARANTIR 2 VAGAS POR R$497"
- **Seções reordenadas** para melhor fluxo de conversão: TargetAudience movido antes de Authority, SocialProof antes de Offer, FAQ logo após Offer, BeliefBreaking antes de Offer
- Botões com shadow glow colorido e easing premium (cubic-bezier)
- Cards dos Pilares, Aprendizados, Oferta e FAQ com glassmorphism
- Ancoragem de preço melhorada: "De R$6.000 a R$8.000 no presencial"
- `package.json` limpo (removido @google/genai, express, dotenv)
- `vite.config.ts` limpo (removido GEMINI_API_KEY, DISABLE_HMR)
- `index.html` com lang="pt-BR" e meta tags SEO

### Removed
- `LP aistudio.zip` (já extraído)
- `lp-aistudio/` (backup redundante)
- Dependências desnecessárias: `@google/genai`, `express`, `dotenv`, `@types/express`, `tsx`

### Fixed
- Hero CTA genérico ("RESERVAR MINHA VAGA") → específico com preço
- Offer Individual CTA sem preço → com preço
- `<html lang="en">` → `<html lang="pt-BR">`

---

## [2026-04-09] - Claude (Setup inicial)

### Added
- Documentação completa do projeto em AGENTS.md
- Instruções específicas para cada IA (CLAUDE.md, CODEX.md, GEMINI.md, QWEN.md)
- LP base extraída do Google AI Studio (React + Vite + Tailwind v4 + Motion)
- Copy completa da LP via Magnus (Copy Magnus.md)
- Benchmarks visuais de concorrentes (Acelerador Empresarial, Médico Empresário, X5 MED atual)
- Estrutura de pastas organizada (assets/, benchmarks/)

### Changed
- AGENTS.md reescrito com contexto completo do projeto, tech stack, paleta, seções, tarefas
- Todos os arquivos de config de IA atualizados com instruções relevantes
