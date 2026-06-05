---
name: stitch-design
description: Integrates Google Stitch AI (powered by Gemini 3.0 Flash / 3.1 Pro) via MCP for vibe design and design-to-code workflows, using DESIGN.md, Design DNA extraction, and multi-screen generation
---

# Stitch Design Skill

Integra o **Google Stitch** (stitch.withgoogle.com) como ferramenta de design via MCP, permitindo um pipeline completo de **vibe design → design-to-code**. O Stitch gera interfaces de alta fidelidade a partir de texto, sketches, imagens ou voz, e esta skill conecta esse output ao workflow de desenvolvimento.

> **Tipo**: Capability Uplift
> Permite que a IA acesse designs do Stitch, extraia Design DNA via `DESIGN.md`, gere novas telas e converta tudo em código funcional — sem copiar/colar manual.

## Modelos (Atualizado Março 2026)

O Stitch agora roda em **Gemini 3.0 Flash** e **Gemini 3.1 Pro**, com dois modos distintos:

| Modo | Modelo | Velocidade | Qualidade | Quando Usar |
|------|--------|-----------|-----------|-------------|
| **3 Flash** | Gemini 3.0 Flash | ~60-90s/tela | Alta | Exploração rápida, iteração, bulk generation |
| **Thinking** | Gemini 3.1 Pro | Mais lento | Máxima | Polish final, layouts complexos, tipografia refinada |

> **Dica de créditos:** O sistema mudou de limite mensal para **créditos diários** (reset à meia-noite UTC). Use Flash para explorar e Thinking só para polish final — 8 a 12 telas por dia é viável se priorizar Flash.

### O que melhorou com Gemini 3

- **Código mais semântico** — HTML com markup semântico correto, stylesheets melhor organizadas
- **Melhor espaçamento e tipografia** — especialmente no modo Thinking (3.1 Pro)
- **Hierarquia de componentes** — o modelo entende melhor a relação entre elementos
- **5 telas simultâneas** — gera até 5 telas de uma vez (antes era 1)
- **Telas sequenciais automáticas** — gera telas lógicas de continuação baseadas em cliques

## Quando Usar Esta Skill

Ative quando o usuário:
- Pedir para "puxar o design do Stitch", "usar o Stitch" ou "integrar com Stitch"
- Quiser converter designs do Stitch em código (HTML, React, etc.)
- Pedir para extrair cores, fontes ou layouts de um projeto Stitch
- Quiser gerar novas telas de UI via prompt de texto ou voz
- Mencionar "vibe design", "design-to-code", "Design DNA", "DESIGN.md" ou "Stitch MCP"

## DESIGN.md — O Coração do Design System

O `DESIGN.md` é o novo formato portátil de design system do Stitch. É um arquivo markdown em linguagem natural que viaja entre ferramentas de design e código.

### O que contém

- Paleta de cores (primárias, secundárias, neutros, acentos)
- Tipografia (famílias, pesos, tamanhos, line-heights)
- Espaçamento (base unit, padding, gaps, border-radius)
- Padrões de componentes (cards, botões, inputs, navbars)
- Guidelines visuais (glassmorphism, sombras, gradientes)

### 3 Formas de Criar um DESIGN.md

1. **Descrever o vibe** — "um app de café acolhedor com cores quentes, cantos arredondados e sensação amigável" → Stitch traduz em design system completo
2. **Fornecer URL ou imagem** — Stitch extrai paleta, tipografia e padrões de estilo de qualquer site/imagem
3. **Escrever manualmente** — para usuários avançados que querem controle total

### Por que importa

> Sem `DESIGN.md`, cada tela gerada é independente. Com `DESIGN.md`, todas as telas seguem as mesmas regras visuais automaticamente.

**Best practice:** Configure o `DESIGN.md` ANTES de começar a gerar telas.

## Setup do MCP Server

### Método Recomendado — `@_davideast/stitch-mcp` com API Key

> Este é o setup ativo neste projeto. Usa API Key (sem depender de OAuth/browser), ideal para WSL/SSH.

**Setup (já configurado):**
```bash
claude mcp add stitch -e STITCH_API_KEY=SUA_KEY -- npx @_davideast/stitch-mcp proxy
```

**Como gerar a API Key:**
1. Acesse stitch.withgoogle.com → Settings
2. Gere uma API Key
3. Use no comando acima

**Virtual Tools (alto nível para coding agents):**

| Tool | Descrição |
|------|-----------|
| `build_site` | Mapeia telas para rotas e retorna HTML de cada página |
| `get_screen_code` | Baixa HTML/CSS de uma tela específica |
| `get_screen_image` | Baixa screenshot da tela como base64 |

Além das virtual tools, o **proxy mode** também expõe as **upstream tools do Stitch MCP oficial** (list_projects, list_screens, generate, extract, etc.).

**Comandos CLI úteis (fora do MCP):**

| Comando | Descrição |
|---------|-----------|
| `npx @_davideast/stitch-mcp init` | Wizard de setup (alternativa ao API Key) |
| `npx @_davideast/stitch-mcp doctor --verbose` | Diagnóstico de configuração |
| `npx @_davideast/stitch-mcp serve` | Preview local das telas |
| `npx @_davideast/stitch-mcp view --projects` | Navegar projetos no terminal |
| `npx @_davideast/stitch-mcp logout --force` | Limpar auth |

**Variáveis de ambiente:**

| Variável | Uso |
|----------|-----|
| `STITCH_API_KEY` | Auth direta sem OAuth (recomendado em WSL) |
| `STITCH_ACCESS_TOKEN` | Token pré-existente |
| `STITCH_USE_SYSTEM_GCLOUD` | Usar gcloud do sistema (`"1"`) |
| `STITCH_PROJECT_ID` | Override do project ID |

### Alternativa — `stitch-mcp` (Kargatharaakash, 9 tools)

Mais tools nativas, mas requer gcloud auth via browser:

```bash
claude mcp add stitch -- npx -y stitch-mcp
```

Requer `GOOGLE_CLOUD_PROJECT` e `gcloud auth application-default login`.

**Tools adicionais:** `generate_screen_from_text`, `extract_design_context`, `create_project`, `list_projects`, `list_screens`, `get_project`, `get_screen`, `fetch_screen_code`, `fetch_screen_image`

### SDK oficial (`google-labs-code/stitch-sdk`)

Para integração programática em agentes de IA:

```typescript
import { StitchToolClient } from '@anthropic/stitch-sdk';
// Retorna Stitch MCP tools como objetos compatíveis com Vercel AI SDK
```

## Novidades: Canvas Infinito e Design Agent (Março 2026)

### Canvas Infinito AI-Nativo
- Espaço ilimitado para explorar ideias — de rascunhos a protótipos funcionais
- Aceita múltiplos tipos de input: **texto, imagens e código**
- Telas conectadas com transições e user flows

### Design Agent
- Agente que raciocina sobre **toda a evolução do projeto** (não apenas a tela atual)
- **Agent Manager** para trabalhar em múltiplas ideias em paralelo
- Mantém consistência visual mesmo em projetos com dezenas de telas

### Voice Canvas (Preview)
- Falar com o canvas via **Gemini Live**
- O agente vê o canvas e telas selecionadas em tempo real
- Casos de uso: critique de design ao vivo, geração por entrevista, variações rápidas ("me mostra 3 opções de menu")

## Workflow

### Fase 1: Setup do Design System

```
1. Criar ou importar DESIGN.md no projeto Stitch
   → Opção: descrever o vibe, fornecer URL, ou escrever manual
2. Verificar que o MCP server "stitch" está conectado
3. Listar projetos (list_projects) e identificar o relevante
```

### Fase 2: Extração de Design DNA

```
4. Extrair DESIGN.md / Design DNA do projeto (extract_design_context)
   → Retorna: paleta de cores, fontes, espaçamentos, componentes, guidelines
5. Salvar como DESIGN.md ou design-tokens.css no repositório local
6. Baixar screenshots das telas principais (fetch_screen_image)
```

### Fase 3: Geração de Novas Telas (opcional)

```
7. Gerar telas via generate_screen_from_text
   → Pode gerar até 5 telas simultâneas
   → O DESIGN.md garante consistência visual automática
   → Usar modo Flash para explorar, Thinking para polish
8. Iterar: o Stitch gera telas sequenciais automáticas baseadas em cliques
```

### Fase 4: Design-to-Code

```
9. Baixar HTML/CSS das telas finalizadas (fetch_screen_code)
   → Gemini 3 gera markup mais semântico que versões anteriores
10. Converter DESIGN.md em variáveis CSS / design tokens
11. Adaptar ao framework do projeto (React, Vue, HTML puro, etc.)
12. Ajustar responsividade e micro-interações
```

## ⚡ Regras Críticas

- **CONFIGURE O DESIGN.md ANTES de gerar telas** — sem ele, cada tela é inconsistente
- **SEMPRE extraia o Design DNA antes de gerar código** — garante consistência visual
- **NÃO copie o HTML do Stitch literalmente** — use como referência, adapte ao stack
- **PRESERVE a identidade visual** — cores, fontes e espaçamentos do DESIGN.md são lei
- **USE modo Flash para explorar, Thinking para refinar** — otimiza créditos
- **COMBINE com elite-web-designer** — Stitch para estrutura, elite-web-designer para micro-animações e polish premium

## Skills Complementares (google-labs-code/stitch-skills)

Repositório oficial com **2.400+ stars**, skills instaláveis para Antigravity/Claude Code:

```bash
# Instalar skills do Stitch globalmente
npx skills add google-labs-code/stitch-skills --skill stitch-design --global
npx skills add google-labs-code/stitch-skills --skill stitch-loop --global
npx skills add google-labs-code/stitch-skills --skill react-components --global
```

| Skill | Descrição |
|-------|-----------|
| `stitch-design` | Sistema unificado de design (prompt enhancement + geração) |
| `stitch-loop` | Sites multi-página a partir de um único prompt |
| `react-components` | Converte telas Stitch em componentes React |
| `shadcn-ui` | Integração com shadcn/ui |
| `design-md` | Gera documentação de design system (DESIGN.md) |
| `enhance-prompt` | Refina prompts vagos em prompts Stitch-compatíveis |
| `remotion` | Vídeos walkthrough de projetos Stitch |

## Troubleshooting

| Problema | Solução |
|----------|---------|
| MCP server não conecta | Rodar `npx @_davideast/stitch-mcp doctor --verbose` para diagnóstico |
| Auth falha no WSL/SSH | Usar `STITCH_API_KEY` em vez de OAuth (browser não abre) |
| Token OAuth expira (~1h) | API Key não expira. Ou usar proxy mode que faz refresh automático |
| "Already authenticated" mas não funciona | `npx @_davideast/stitch-mcp logout --force --clear-config` e reconfigurar |
| Design genérico sem consistência | Criar `DESIGN.md` antes de gerar telas — ele define as regras visuais |
| `generate_screen_from_text` retorna design fraco | Usar modo **Thinking** (Gemini 3.1 Pro) para qualidade máxima |
| HTML exportado não é responsivo | Normal — Stitch gera para viewport fixo. Adaptar com media queries |
| Créditos acabaram rápido | Priorizar modo Flash (mais barato) e reservar Thinking para polish final |
| Debug de conexão | Checar log em `/tmp/stitch-proxy-debug.log` (usar flag `--debug` no proxy) |

## Best Practices

1. **DESIGN.md primeiro** — configure antes de gerar qualquer tela. Pode ser um vibe description simples
2. **Flash para explorar, Thinking para refinar** — otimiza créditos e qualidade
3. **Itere, não busque perfeição no prompt** — o primeiro prompt só precisa superar a página em branco
4. **Workflow recomendado 2026:** Explore no Stitch → Refine no Figma (se necessário) → Build no Antigravity/Claude Code
5. **Salve DESIGN.md no repo** — ele viaja entre Stitch, Figma, e coding assistants
6. **Combine Stitch + elite-web-designer** — Stitch para estrutura/layout, elite-web-designer para polish premium
7. **Para projetos React**, instale a skill `react-components` do stitch-skills
8. **Use voz para iteração rápida** — Voice Canvas (preview) é mais rápido que digitar para variações
