# Modelo — odontologia de urgência

Esqueleto pronto. Nada aqui é de cliente real: todo texto e toda imagem
são placeholder.

- **Direção visual:** azul clínico sobre branco, Manrope nos títulos e Inter
  no corpo. Tom de urgência sem parecer pronto-socorro.
- **Movimento:** preloader, scroll suave (Lenis), reveal e contadores com
  GSAP + ScrollTrigger, marquee, relógio de plantão ao vivo, FAQ em accordion.
- **Stack:** HTML + CSS + JS separados, sem build.

⚠️ **Depende de CDN.** GSAP, ScrollTrigger e Lenis vêm do jsdelivr — o site
não anima offline nem sem internet. Se precisar funcionar offline, baixe as
três bibliotecas pra `assets/` e troque os `<script src>` no fim do HTML.

## 1. Textos

Todo placeholder está entre **colchetes maiúsculos**. Busque no `index.html`
pelo caractere `[` e você acha todos.

| Placeholder | O que é |
|---|---|
| `[NOME DA CLÍNICA]` | nome da marca (nav, rodapé, título, preloader) |
| `[NOME DO DENTISTA]` | nome do profissional que atende |
| `[CRO 00000/UF]` · `[CRO]` | registro no conselho — **obrigatório** |
| `[UNIVERSIDADE]` · `[ANO]` · `[ESPECIALIDADE]` | formação e credenciais |
| `[CIDADE — UF]` · `[ENDEREÇO]` · `[EDIFÍCIO]` · `[BAIRRO]` | localização |
| `[@INSTAGRAM]` | handle; o `href` está como `#`, trocar pelo link real |
| `[N]` | número de especialidades atendidas |
| `[A CONFIRMAR]` | telefone/WhatsApp |

Os números da faixa de estatísticas ficam no atributo `data-count` de cada
`.stat__num` — o contador anima até esse valor. Hoje estão zerados/neutros.

## 2. Imagens

Tudo em `assets/placeholder/`. Troque o arquivo mantendo o nome, ou aponte
o `src` pra sua pasta.

| Arquivo | Proporção | Onde aparece |
|---|---|---|
| `retrato.svg` | 440×506 | foto do dentista — hero e avatar de 60px |
| `atendimento-1.svg` | 1200×900 | dentista paramentado, seção consultório |
| `atendimento-2.svg` | 1200×900 | procedimento em andamento |
| `consultorio-a.svg` | 1400×1000 | espaço do consultório |
| `consultorio-b.svg` | 1600×1000 | **usado em CSS**, não no HTML |

`consultorio-b.svg` entra como `background-image` em `assets/styles.css`
(procure por `url('placeholder/`). Como fica atrás de texto, o rótulo dele
é bem apagado de propósito — troque por uma foto escura, com contraste baixo.

## 3. WhatsApp

Não há constante de configuração neste modelo: os links estão direto no HTML.
Busque por `href="#local"` — são os botões de WhatsApp, hoje apontando pra
seção de localização. Troque cada um por:

```
https://wa.me/55DDDNUMERO?text=mensagem%20pronta
```

São 12 ocorrências, incluindo o botão flutuante (`class="fab"`).

## 4. Mapa

O iframe da seção `#local` está com o endereço em placeholder. Troque o `q=`
pela URL do endereço real:

```
https://www.google.com/maps?q=Rua+Exemplo,+123,+Cidade+-+UF&output=embed
```

---

## Como abrir

Duplo clique em `index.html`. Precisa de internet por causa das CDNs.
Pra hospedar: arraste a pasta `site/` pro Netlify/Vercel.

## Publicidade odontológica — ler antes de publicar

O CFO (Código de Ética Odontológica) é rígido. Em qualquer peça pública:

- **CRO do responsável é obrigatório** — nome e número visíveis.
- **Especialidade só pode ser anunciada se registrada** no conselho.
  "Especialista em X" sem registro é infração ética.
- **Nunca prometer resultado**, nem sugerir garantia de cura ou prazo.
- **Antes/depois é proibido** em publicidade odontológica pelo CFO — este
  modelo não tem seção de antes/depois de propósito. Não adicione.
- Nada de preço, promoção, desconto ou "concorrência desleal".
- Prova social ("centenas de pacientes", nota de avaliação) só entra se for
  verificável — de preferência linkando o Google Meu Negócio real.
