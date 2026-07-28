// ============================================================
// SCROLL — Lenis (inércia) + ScrollTrigger (gatilhos) integrados
// ============================================================
//
// O acordo entre os dois mundos:
//   • Lenis é o dono do scroll — suaviza a roda do mouse com inércia.
//   • ScrollTrigger é o leitor — dispara e "esfrega" (scrub) animações.
//   • progressoRolagem é a ponte com o WebGL: o ScrollTrigger escreve
//     números aqui, e o useFrame da cena lê a cada frame. DOM e canvas
//     nunca se tocam diretamente — só trocam números por este objeto.

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

export const progressoRolagem = {
  hero: 0,       // 0 = topo da página · 1 = hero já saiu da tela
  sair: 0,       // 0 = fita em cena · 1 = fita saiu (projetos chegando)
  velocidade: 0, // velocidade instantânea do Lenis — os cards entortam com ela
}

export function iniciarScrollSuave() {
  const lenis = new Lenis({
    // duração da inércia; 1.15s é encorpado sem ficar "barco"
    duration: 1.15,
    // easing exponencial: desacelera rápido no fim, nunca para seco
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  // Toda rolagem do Lenis avisa o ScrollTrigger e registra a velocidade
  // (px/frame, com sinal: positivo descendo, negativo subindo)
  lenis.on('scroll', (evento) => {
    ScrollTrigger.update()
    progressoRolagem.velocidade = evento.velocity
  })

  // O relógio do GSAP passa a dirigir o Lenis: um único loop pra tudo
  // (ticker entrega segundos; Lenis espera milissegundos, daí o * 1000)
  const tique = (tempo) => lenis.raf(tempo * 1000)
  gsap.ticker.add(tique)

  // Sem "pulos" de compensação quando uma aba volta do segundo plano
  gsap.ticker.lagSmoothing(0)

  // Função de limpeza — o React chama ao desmontar
  return () => {
    gsap.ticker.remove(tique)
    lenis.destroy()
  }
}

export { gsap, ScrollTrigger }
