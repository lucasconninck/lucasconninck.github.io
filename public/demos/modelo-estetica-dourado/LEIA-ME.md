# Modelo claro + dourado — como preencher

Esqueleto pronto. Nada aqui é de cliente real: todo texto e toda imagem
são placeholder.

## 1. Textos

Todo placeholder está entre **colchetes maiúsculos**. Busque no `index.html`
pelo caractere `[` e você acha todos.

| Placeholder | O que é |
|---|---|
| `[NOME DA CLÍNICA]` | nome da marca (preloader, nav, rodapé, título, alt) |
| `[CIDADE — UF]` / `[CIDADE/UF]` | praça de atendimento |
| `[ENDEREÇO]` · `[BAIRRO]` · `[CEP]` | endereço completo (contato + FAQ + mapa) |
| `[@INSTAGRAM]` | handle; o `href` está como `#`, trocar pelo link real |
| `[X]` | anos de clínica — no hero, no selo e na linha do tempo |
| `[A CONFIRMAR]` | dado que ainda falta — aparece destacado no site de propósito |

## 2. Imagens

Tudo em `img/placeholder/`. Troque o arquivo mantendo o nome (aí não precisa
mexer no HTML) ou aponte o `src` pra sua pasta.

| Arquivo | Proporção | Onde aparece |
|---|---|---|
| `retrato.svg` | 1000×1250 | fundadora, seção "História" |
| `antes.svg` | 1200×1200 | lado "antes" dos 12 comparadores |
| `depois.svg` | 1200×1200 | lado "depois" dos 12 comparadores |
| `editorial-1..6.svg` | 1000×1400 | galeria do espaço, com lightbox |
| `hero.svg` · `ambiente.svg` · `marca-*.svg` | — | sobrando, se precisar |

A borboleta de glitter do hero é um **canvas gerado em código** (`id="flutter"`),
não é imagem — não precisa trocar nada.

Os comparadores usam `--ratio` inline em cada card — a mesma imagem é cortada
de forma diferente em cada um. Por isso os placeholders `antes`/`depois` são
quadrados com o rótulo repetido: sobrevivem a qualquer recorte.

## 3. WhatsApp

No `<script>`, no topo:

```js
var WHATSAPP = '';   // 55 + DDD + número, só dígitos. Ex.: '5543999998888'
```

Vazio = todos os CTAs apenas rolam pra `#contato`. Preenchido = viram link de
WhatsApp com a mensagem do `data-wpp` de cada botão. O formulário de contato
também usa essa constante.

## 4. Mapa

O iframe está com `src="about:blank"` de propósito. O endereço real vai no
`data-src` — quando tiver, troque `about:blank` pela URL:

```
https://www.google.com/maps?q=Rua+Exemplo,+123,+Cidade+-+UF&output=embed
```

## 5. Botões magnéticos

Os CTAs têm `data-magnetic` — eles seguem o cursor. Esse efeito já foi
reprovado uma vez em outro projeto. Se não quiser, é só remover o atributo
`data-magnetic` dos botões; nada mais depende dele.

---

## Como abrir

Duplo clique em `index.html`. Funciona offline, sem instalar nada.
Pra hospedar: arraste a pasta `site/` pro Netlify/Vercel.

Modo captura pra PDF/screenshot: `index.html?print` — entrega tudo revelado,
sem animação.

## Regulação — ler antes de publicar

Estética/saúde é publicidade regulada:

- Nunca prometer ou garantir resultado. O texto já diz "resultados variam" —
  manter esse cuidado ao editar.
- Antes/depois só entra com **autorização de imagem de cada paciente** (LGPD)
  e dentro da regra do conselho da responsável técnica.
- **Responsável técnica** (nome + registro) é obrigatória no rodapé.
- Números (anos de clínica, nº de atendimentos) só entram se o cliente confirmar.
