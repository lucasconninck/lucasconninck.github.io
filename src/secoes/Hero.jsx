import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, progressoRolagem } from '../anim/scroll'
import { WHATSAPP_LINK } from '../data/contato'
import { projetos } from '../data/projetos'

// Números honestos — nada de "+300 projetos".
//
// O primeiro sai de `projetos.js` de propósito: mexeu na vitrine, o hero
// acompanha sozinho. Antes era 6 fixo no código e ficou mentindo quando a
// Spettacolo saiu da lista — o cabeçalho da vitrine dizia 05 e o hero, 06.
const NUMEROS = [
  { valor: projetos.length, rotulo: 'sites no ar' },
  { valor: 5, rotulo: 'segmentos' },
  { valor: 1, rotulo: 'painel do cliente' },
]

export default function Hero({ movimentoReduzido }) {
  const secao = useRef(null)

  useEffect(() => {
    if (movimentoReduzido) return undefined

    const contexto = gsap.context(() => {
      // A ponte DOM → WebGL: enquanto o primeiro 120% de tela rola,
      // progresso vai de 0 a 1 e a fita cromada se desenrola.
      ScrollTrigger.create({
        start: 0,
        end: () => window.innerHeight * 1.2,
        onUpdate: (gatilho) => {
          progressoRolagem.hero = gatilho.progress
        },
      })

      // Os números contam de 00 até o valor real na entrada da página
      secao.current.querySelectorAll('.hero-numeros strong').forEach((el) => {
        const alvo = Number(el.dataset.valor)
        const contador = { v: 0 }
        gsap.to(contador, {
          v: alvo,
          duration: 1.6,
          delay: 0.9,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = String(Math.round(contador.v)).padStart(2, '0')
          },
        })
      })
    }, secao)

    return () => contexto.revert()
  }, [movimentoReduzido])

  return (
    <>
      <header className="topo">
        <a className="marca" href="/">
          <b>
            Lucas Lima<span>®</span>
          </b>
          <em>Web Designer</em>
        </a>
        <a
          className="topo-contato"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
        >
          Vamos conversar ↗
        </a>
      </header>

      <section className="hero" ref={secao} aria-label="Apresentação">
        <h1 className="hero-titulo">
          <span className="linha">
            <span>Muito além</span>
          </span>
          <span className="linha">
            <span>de um site</span>
          </span>
        </h1>

        <div className="hero-baixo">
          <p className="hero-frase">
            Uma ferramenta para aumentar suas vendas: experiências digitais
            que unem design, velocidade e estratégia para transformar acessos
            em oportunidades reais.
          </p>

          <ul className="hero-numeros">
            {NUMEROS.map((n) => (
              <li key={n.rotulo}>
                {/* o texto já nasce com o valor final: sem JS (ou com menos
                    movimento) ninguém fica vendo "00" pra sempre */}
                <strong data-valor={n.valor}>
                  {String(n.valor).padStart(2, '0')}
                </strong>
                <span>{n.rotulo}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-role" aria-hidden="true">
          <span>role</span>
          <i />
        </div>
      </section>
    </>
  )
}
