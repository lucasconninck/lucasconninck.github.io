# Portfólio — Lucas Lima · Web Designer

### 🌐 No ar em **[lucasconninck.github.io](https://lucasconninck.github.io)**

Site de portfólio pessoal. Experiência em WebGL comandada pelo scroll, no
espírito de referências como a [lusion.co](https://lusion.co) — um único mundo
3D contínuo por trás de conteúdo HTML real.

**Posicionamento:** sites sob medida para negócios locais em todo o Brasil.

---

## Rodar

Precisa de Node.js (testado na v24).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera dist/ (site estático, pode ser servido por qualquer lugar)
npm run preview  # confere o build antes de publicar
```

## Stack

| Peça | Papel |
| --- | --- |
| React + Vite | estrutura e build |
| Three.js + React Three Fiber + drei | a cena 3D |
| GSAP + ScrollTrigger | linha do tempo das animações |
| Lenis | scroll com inércia |
| GLSL próprio | fita cromada e distorção dos cards |
| Archivo + Inter (Fontsource) | tipografia, self-hosted |

## Como o site é montado

O princípio: **um só canvas WebGL**, fixo em tela cheia, vivo do começo ao fim.
As seções não têm "cada uma o seu 3D" — o mesmo objeto atravessa a página.

```
src/
  App.jsx                  monta as duas camadas (canvas atrás, conteúdo na frente)
  anim/scroll.js           Lenis + ScrollTrigger integrados; a PONTE com o WebGL
  scene/
    CenaPrincipal.jsx      o <Canvas>, detecção de WebGL e fallback
    FitaCromada.jsx        o objeto do hero
    PlanosProjetos.jsx     os cards da vitrine, sincronizados com o DOM
    registroVisuais.js     mapa slug → elemento DOM (a outra ponte)
    shaders/               .vert e .frag, comentados linha a linha
  secoes/                  Hero, Manifesto, Projetos, Metodo, Servicos, Contato
  styles/                  tokens.css manda em cor, tipografia e espaçamento
  data/
    projetos.js            a vitrine inteira sai daqui
    contato.js             WhatsApp e e-mail — um lugar só
```

**A ponte DOM → WebGL.** DOM e canvas nunca se tocam: trocam números pelo
objeto `progressoRolagem` (`anim/scroll.js`). O ScrollTrigger escreve progresso
e velocidade; o `useFrame` da cena lê a cada frame. Os cards da vitrine usam a
segunda ponte, `registroVisuais`: cada `<figure>` se registra, e o plano 3D lê
o `getBoundingClientRect()` dele pra se posicionar exatamente em cima.

## Acessibilidade e degradação

O conteúdo **mora no DOM** — o canvas é `aria-hidden` e não captura cliques.
Leitor de tela e Google leem um site normal.

| Situação | O que acontece |
| --- | --- |
| Desktop com WebGL | experiência completa, pixel ratio limitado a 2 |
| Sem WebGL | canvas não é criado; entra um fundo champanhe em CSS |
| `prefers-reduced-motion` | sem Lenis, sem entradas, fita congelada num frame |
| Qualquer um dos dois acima | vitrine vira lista vertical com `<img>` normais |

## Publicar

Não precisa rodar build na mão. **Todo push na `main` publica o site**:
o workflow `.github/workflows/publicar.yml` instala, constrói e joga o
`dist/` no GitHub Pages.

```bash
git add -A
git commit -m "o que mudou"
git push          # ~2 min depois está no ar
```

Acompanhar ou republicar sem mudar código: aba **Actions** → "Publicar site".

## O que fica de fora do repositório

`_arquivo/` está no `.gitignore` e **nunca sobe**. Guarda:

| Item | Por quê |
| --- | --- |
| `champanhe/` | versão anterior do portfólio, só consulta |
| `demo-spettacolo/` + `capa-spettacolo.jpg` | proposta de prospecção, não confirmada |
| `portfolio-lucas-lima-github.bundle` | histórico completo do repo privado antigo |

Demos de clínica de estética (fotos de antes/depois de pacientes) **não entram
neste repositório**: dependem de autorização de imagem sob a LGPD. Estão só
dentro do bundle acima.

Pra recuperar qualquer coisa do bundle:

```bash
git clone _arquivo/portfolio-lucas-lima-github.bundle recuperado
```

## Pendências

- [ ] Imagem de compartilhamento (`og:image`)
- [ ] Preloader com contador
- [ ] Code-split do bundle JS (1,2 MB — passa do limite de aviso do Vite)

---

© 2026 Lucas Lima
