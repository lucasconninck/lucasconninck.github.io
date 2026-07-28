// ============================================================
// CARREGAMENTO — o que a barra da tela de abertura está medindo
// ============================================================
//
// O véu e o motor da barra moram no `index.html` (inline, porque
// precisam existir antes deste bundle). Este arquivo é o outro lado
// da conversa: ele diz o que já terminou de carregar.
//
// A regra: a barra só anda com evento REAL. Nada de temporizador
// fingindo progresso — entre uma etapa e outra ela apenas se aproxima
// da próxima e desacelera (o teto de 35% do motor lá no HTML).
//
// As etapas, e por que cada uma está aqui:
//   app     — o bundle chegou e está executando (é o download longo)
//   fontes  — até elas chegarem, o texto troca de forma na tela
//   cena    — o contexto WebGL nasceu (ou não existe, e a gente segue)
//   capa:*  — as seis capas da vitrine. Não é download extra: são os
//             MESMOS arquivos que o useTexture pede logo em seguida.
//             Esperar por elas aqui é o que impede o usuário de chegar
//             na vitrine e encontrar card preto.

import { projetos } from './data/projetos'

// Quanto cada etapa vale na barra. Capa não aparece aqui: vale 1.
const PESO = { app: 3, fontes: 2, cena: 2 }

// Teto próprio, mais curto que o do motor: passou disso, o site abre e o
// que faltar termina de carregar por trás. Conexão ruim não vira cadeia.
//
// 4,5s é o limite medido: num 4G ruim (1,5 Mbps, cache vazio) o bundle e
// as fontes chegam por volta dos 3s e as capas arrastam até uns 7s. As
// capas só importam três telas abaixo — não vale prender o hero por elas.
const TETO_MS = 4500

const motor = typeof window === 'undefined' ? null : window.CARGA

const total = PESO.app + PESO.fontes + PESO.cena + projetos.length
const feitas = new Set()
let acumulado = 0

/**
 * Marca uma etapa como concluída. Idempotente de propósito: o StrictMode
 * monta os componentes duas vezes em desenvolvimento.
 */
export function marcarEtapa(nome) {
  if (!motor || feitas.has(nome)) return
  feitas.add(nome)
  acumulado += PESO[nome] ?? 1
  motor.progresso(acumulado / total)
  if (acumulado >= total) motor.fim()
}

/**
 * Promessa que resolve quando o véu começa a subir — o sinal pra tocar
 * o que estava segurado atrás dele (Lenis, contadores do hero).
 *
 * Sem véu (desktop) ou com ele já encerrado, resolve na hora: quem espera
 * por isso nunca fica pendurado.
 */
export const cargaConcluida = new Promise((resolver) => {
  if (!motor || motor.acabou) {
    resolver()
    return
  }
  window.addEventListener('carga:fim', () => resolver(), { once: true })
})

export function iniciarCarregamento() {
  if (!motor) return

  marcarEtapa('app')

  // document.fonts.ready resolve quando toda fonte pedida pelo CSS chegou
  const fontes = document.fonts ? document.fonts.ready : Promise.resolve()
  fontes.then(() => marcarEtapa('fontes')).catch(() => marcarEtapa('fontes'))

  projetos.forEach((projeto) => {
    const img = new Image()
    // O TextureLoader do three pede as capas com CORS ligado. Sem esta
    // linha o navegador guardaria DUAS entradas de cache pro mesmo arquivo
    // (uma com CORS, outra sem) e a imagem seria baixada de novo.
    img.crossOrigin = 'anonymous'
    const pronta = () => marcarEtapa(`capa:${projeto.slug}`)
    img.onload = pronta
    img.onerror = pronta // capa quebrada não pode prender a tela
    img.src = projeto.capa
  })

  // O teto conta do INÍCIO DA PÁGINA, não daqui: quando este módulo roda,
  // boa parte dos 4,5s já foi embora baixando o próprio bundle. Contando
  // daqui, uma rede lenta somava as duas esperas e o véu ficava ~7s no ar.
  const restante = Math.max(500, TETO_MS - performance.now())
  setTimeout(() => motor.fim(), restante)
}
