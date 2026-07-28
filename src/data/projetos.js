// ============================================================
// PROJETOS — fonte única de dados da vitrine
// ============================================================
//
// A seção de projetos lê SÓ este arquivo — pra mudar a lista, basta
// editar aqui; nenhum layout depende disso.
//
// A demo da Spettacolo saiu daqui: é proposta de prospecção e mora em
// `_arquivo/demo-spettacolo/`, fora do que vai pro ar.
//
// Os três "modelo-*" são esqueletos sem cliente: conteúdo todo em
// placeholder. Servem de vitrine de layout enquanto não recebem um
// projeto. Trocar nome/segmento quando isso acontecer.
//
// ⚠️ `demo` termina em **index.html**, não na barra da pasta. Motivo: o
// servidor de desenvolvimento do Vite não resolve índice de diretório
// dentro de `public/` — ele devolve o index.html do PRÓPRIO portfólio.
// O card abria uma aba nova que caía de volta no portfólio, e parecia
// que o clique não funcionava. Apontando pro arquivo, funciona em dev,
// no GitHub Pages e até abrindo o `dist/` direto do disco.
//
// `capa` é obrigatória e o arquivo precisa existir em `public/capas/`:
// a vitrine carrega a imagem como textura WebGL e uma capa faltando
// derruba o canvas inteiro (não há error boundary na cena).

export const projetos = [
  {
    slug: 'aconchego-pet',
    nome: 'Aconchego Pet',
    segmento: 'Pet shop — ilustração e entrada em escada',
    demo: '/demos/aconchego-pet/index.html',
    capa: '/capas/aconchego-pet.jpg',
  },
  {
    slug: 'dental-health',
    nome: 'Dental Health',
    segmento: 'Odontologia — mosaico de uma foto só',
    demo: '/demos/dental-health/index.html',
    capa: '/capas/dental-health.jpg',
  },
  {
    slug: 'modelo-estetica-editorial',
    nome: 'Modelo — estética (editorial)',
    segmento: 'Layout editorial champanhe',
    demo: '/demos/modelo-estetica-editorial/index.html',
    capa: '/capas/modelo-estetica-editorial.jpg',
  },
  {
    slug: 'modelo-estetica-dourado',
    nome: 'Modelo — estética (dourado)',
    segmento: 'Layout claro e dourado',
    demo: '/demos/modelo-estetica-dourado/index.html',
    capa: '/capas/modelo-estetica-dourado.jpg',
  },
  {
    slug: 'londripell',
    nome: 'Londripell',
    segmento: 'Papelaria',
    demo: '/demos/londripell/index.html',
    capa: '/capas/londripell.jpg',
  },
  {
    slug: 'ydeall',
    nome: 'Ydeall',
    segmento: 'Moda feminina',
    demo: '/demos/ydeall/index.html',
    capa: '/capas/ydeall.jpg',
  },
  {
    slug: 'modelo-odonto-urgencia',
    nome: 'Modelo — odontologia de urgência',
    segmento: 'Layout azul clínico, 24h',
    demo: '/demos/modelo-odonto-urgencia/index.html',
    capa: '/capas/modelo-odonto-urgencia.jpg',
  },
]
