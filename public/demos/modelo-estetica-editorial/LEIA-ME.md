# Modelo editorial — como preencher

Esqueleto pronto. Nada aqui é de cliente real: todo texto e toda imagem
são placeholder.

## 1. Textos

Todo placeholder está entre **colchetes maiúsculos**. Busque no `index.html`
pelo caractere `[` e você acha todos.

| Placeholder | O que é |
|---|---|
| `[NOME DA CLÍNICA]` | nome da marca (nav, menu, título, rodapé, alt) |
| `[CIDADE — UF]` / `[CIDADE]` | praça de atendimento |
| `[ENDEREÇO]` | endereço completo (contato + FAQ + título do mapa) |
| `[@INSTAGRAM]` | handle; o `href` está como `#`, trocar pelo link real |
| `[NOME DO PROGRAMA]` | nome do programa/protocolo assinatura |
| `[NOME DA PACIENTE]` / `[PUBLICAÇÃO]` | crédito do depoimento |
| `[A CONFIRMAR]` | dado que ainda falta — aparece destacado no site de propósito |

Os blocos de depoimento e as legendas de resultado têm frases-guia entre
colchetes explicando o que escrever no lugar.

## 2. Imagens

Tudo em `img/placeholder/`. Troque o arquivo mantendo o nome (aí não precisa
mexer no HTML) ou aponte o `src` pra sua pasta.

| Arquivo | Proporção | Onde aparece |
|---|---|---|
| `hero.svg` | 1600×2000 | fundo do hero (retrato, corta bem no topo) |
| `ambiente.svg` | 1200×1500 | foto do espaço, seção "A clínica" |
| `antes.svg` | 1200×1200 | lado "antes" dos comparadores |
| `depois.svg` | 1200×1200 | lado "depois" dos comparadores |
| `editorial-1..6.svg` | 1000×1400 | galeria com lightbox |
| `marca-simbolo.svg` | 200×200 | símbolo no nav, no menu e no selo |
| `marca-logo.svg` | 600×180 | logotipo do rodapé (fundo escuro) |
| `retrato.svg` | 1000×1250 | sobrando, se precisar de um retrato |

Os comparadores usam `--ratio` inline em cada card — a mesma imagem é cortada
de forma diferente em cada um. Por isso os placeholders `antes`/`depois` são
quadrados com o rótulo repetido: sobrevivem a qualquer recorte.

## 3. WhatsApp

No `<script>`, no topo:

```js
var WHATSAPP = '';   // 55 + DDD + número, só dígitos. Ex.: '5543999998888'
```

Vazio = todos os CTAs apenas rolam pra `#contato`. Preenchido = viram link de
WhatsApp com a mensagem do `data-wpp` de cada botão.

## 4. Vídeo no hero (opcional)

```js
var HERO_VIDEO = '';   // ex.: 'img/hero.mp4'
```

Vazio = usa `img/placeholder/hero.svg` de fundo. Se o arquivo falhar, volta
sozinho pra imagem.

## 5. Mapa

O iframe está com `src="about:blank"` de propósito. O endereço real vai no
`data-src` — quando tiver, troque `about:blank` pela URL:

```
https://www.google.com/maps?q=Rua+Exemplo,+123,+Cidade+-+UF&output=embed
```

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
- Números (anos de clínica, nº de atendimentos, taxa de retorno) só entram
  se o cliente confirmar.
