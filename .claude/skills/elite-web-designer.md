---
name: elite-web-designer
description: Designs and implements premium, highly aesthetic, modern, and dynamic web applications ("sites fodas") with micro-animations, glassmorphism, advanced typography, and vibrant colors.
---

# Elite Web Designer Skill

Transforms basic web design requests into premium, highly aesthetic, modern, and dynamic web applications (referenciados pelo usuário como "sites fodas"). Codifica as melhores práticas de design de UI/UX moderno, focando em estética premium, micro-interações, tipografia avançada e esquemas de cores sofisticados.

## Quando Usar Esta Skill

Ative quando o usuário:
- Pedir para criar um "site foda", "premium", "moderno" ou "avançado".
- Pedir para aplicar "design premium", "estética rica", "animações fluidas" ou "design de alto nível".
- Reclamar que um site atual parece "simples", "feio", "básico" ou "genérico".
- Solicitar a recriação de uma UI inspirada em referências como Apple, Stripe, Linear, Framer ou Vercel.
- Mencionar tendências modernas como "Bento Grid", "Glassmorphism", "Dark Mode premium" ou "Three.js".

## ⚡ Princípio Central

> **Estética é tão importante quanto funcionalidade.**
> Nunca entregue uma interface genérica. O usuário deve ficar maravilhado no primeiro olhar. Cada elemento deve parecer intencional, polido e vivo.

## Diretrizes de Design Premium (O que torna um site "foda")

### 1. Paleta de Cores e Gradientes
*   **Proibido Cores Genéricas:** Nunca use `red`, `blue`, `#FF0000`, etc.
*   **Use HSL/OKLCH:** Prefira HSL ou modelos de cores perceptuais (Oklch) para ajustes finos de saturação e leveza.
*   **Dark Mode Premium:** O fundo escuro não deve ser `#000000`. Use tons muito escuros com toques da cor primária (ex: `#0a0a0c`, `hsl(240, 10%, 4%)`).
*   **Gradientes Suaves:** Use gradientes radiais subtis no background para dar profundidade. O efeito "mesh gradient" fluido é altamente encorajado.
*   **Acentos Vibrantes:** Cores de destaque devem "dourar" a tela (ex: Cyan neon contra um fundo escuro).

### 2. Efeitos Visuais e Profundidade (Glassmorphism & Bento Grids)
*   **Bento Grids:** Organize a informação em layouts modulares assimétricos (grids estilo bento box). É moderno e limpo.
*   **Glassmorphism:** Use painéis translúcidos com blur de fundo (`backdrop-filter: blur(16px)`), bordas finíssimas translúcidas (`border: 1px solid rgba(255, 255, 255, 0.08)`), e sombras complexas (`box-shadow` em múltiplas camadas).
*   **Brilhos e Reflexos:** Adicione um leve inset shadow branco (ou cor correspondente) no topo de cards e botões para simular incidência de luz.

### 3. Micro-Interações e Dinamismo
*   **Hover States Dramáticos:** Cada elemento clicável precisa reagir. Botões devem ter brilho condicional, leve scale up (`transform: scale(1.02)`), ou bordas que acendem no hover.
*   **Transições Fluidas:** Todas as transições devem ser suaves. Use curvas Bezier customizadas em vez de `ease` padrão (ex: `transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1)`).
*   **Scroll Reveal:** Elementos devem aparecer suavemente ao rolar a página (fade up, leve movimento horizontal).
*   **Atenção aos Detalhes:** Efeitos sutis como rastros de mouse ou gradientes que seguem o cursor intensificam o aspecto premium.

### 4. Tipografia Avançada
*   **Fuja dos Padrões:** Nunca use Arial ou Times New Roman.
*   **Google Fonts / Fontes Modernas:** Use fontes geométricas ou neo-grotescas modernas como Inter, Roboto, Outfit, Plus Jakarta Sans, Clash Display ou Syne (para títulos com impacto).
*   **Contraste Tipográfico:** Títulos massivos (com letter-spacing ligeiramente negativo) contrastando com textos de corpo menores e legíveis (com line-height otimizado, ex: 1.6).

## Workflow

Siga este processo sistemático ao receber um pedido para criar ou melhorar uma UI:

1.  **Análise e Inspiração (Planejamento):**
    *   Entenda o objetivo do site ou componente.
    *   Defina um tema visual e uma paleta de cores harmoniosa, desenhada para criar um impacto "wow".
    *   Selecione as tipografias modernas a serem utilizadas.
2.  **Fundação e Design System:**
    *   Comece definindo ou modificando o arquivo CSS principal (ex: `index.css`, `globals.css`).
    *   Crie variáveis CSS (`--`) para todas as cores primárias, secundárias, tons de fundo, níveis de vidro (glassmorphism), e sombras complexas.
    *   Importe a tipografia.
3.  **Estruturação do Componente/Página (Bento/Layout):**
    *   Construa o HTML estrutural. Dê preferência a abordagens modernas como layouts modulares (Bento Grids) para painéis de informação.
    *   Garanta que a hierarquia de tags (H1, H2, etc.) esteja correta para SEO.
4.  **Estilização Premium:**
    *   Aplique as classes CSS garantindo que o visual não fique plano.
    *   Injete os efeitos de glassmorphism em cards, navbars, modais.
    *   Insira gradientes dinâmicos de fundo.
5.  **Micro-animações (O toque final):**
    *   Adicione `transition` em tudo que for interativo.
    *   Implemente efeitos de hover elaborados.
    *   **Importante:** Gere o código completo e funcional. A interface deve parecer "viva" para o usuário interagir.

## ⛔ Regras Críticas

- **SEM PLACEHOLDERS:** Não deixe "Fazer CSS depois" ou "Inserir lógica aqui". Entregue um design completo e testável.
- **SEJA OUSADO:** Ao aplicar esta skill, tenha permissão tácita para ousar no design. Entre algo superior a um "MVP básico".
- **USE CSS PURO:** A menos que o usuário peça especificamente Tailwind ou outra lib, escreva o CSS puro ou módulos de CSS para ter flexibilidade máxima nos efeitos visuais. Se Tailwind for requisitado, use arquivos de configuração para definir as cores e gradientes customizados.

## Ferramentas de Referência

| Conceito | Abordagem Recomendada (CSS) |
| :--- | :--- |
| Glassmorphism Base | `background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.05);` |
| Sombra Premium | `box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 24px 48px -12px rgba(0,0,0,0.25);` |
| Smooth Transition | `transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);` |
| Gradiente Texto | `background: linear-gradient(135deg, #fff, #a0a0a0); -webkit-background-clip: text; color: transparent;` |

## Troubleshooting

| Problema | Solução |
| :--- | :--- |
| O site parece "sujo" com o Glassmorphism | Simplifique as camadas por trás do filtro. Muito ruído no background destrói o efeito blur. Reduza a opacidade do background do vidro. |
| Cores não harmonizam | Use ferramentas para encontrar tríades ou cores adjacentes em HSL. Prenda-se a uma cor principal dominante e tons neutros com "tint" dessa mesma cor. |
| Animação engasga | Evite animar `width`, `height` ou `box-shadow`. Anime apenas `transform` e `opacity` para performance de 60fps constantes via GPU. |
