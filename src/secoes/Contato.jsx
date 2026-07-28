import { useEffect, useRef } from 'react'
import { gsap } from '../anim/scroll'
import {
  EMAIL,
  WHATSAPP_EXIBICAO,
  WHATSAPP_LINK,
  WHATSAPP_LINK_DEMO,
} from '../data/contato'

export default function Contato({ movimentoReduzido }) {
  const secao = useRef(null)

  useEffect(() => {
    if (movimentoReduzido) return undefined

    const contexto = gsap.context(() => {
      // Mesma revelação por máscara do hero, agora disparada pelo scroll
      gsap.from('.contato-titulo .linha > span', {
        yPercent: 112,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: secao.current,
          start: 'top 62%',
          once: true,
        },
      })
      gsap.from('.contato-acoes, .contato-diretos, .contato-nota', {
        y: 18,
        autoAlpha: 0,
        duration: 0.9,
        delay: 0.35,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: secao.current,
          start: 'top 62%',
          once: true,
        },
      })
    }, secao)

    return () => contexto.revert()
  }, [movimentoReduzido])

  return (
    <section className="contato" ref={secao} aria-label="Contato">
      <span className="rotulo">Orçamento</span>

      <h2 className="contato-titulo">
        <span className="linha">
          <span>Vamos conversar</span>
        </span>
        <span className="linha">
          <span>sobre o seu site?</span>
        </span>
      </h2>

      <div className="contato-acoes">
        {/* caminho 1: a oferta forte — amostra do site, de graça */}
        <a
          className="botao-whats"
          href={WHATSAPP_LINK_DEMO}
          target="_blank"
          rel="noreferrer"
        >
          Quero uma demonstração grátis
        </a>

        {/* caminho 2: quem não quer amostra, só quer falar */}
        <a
          className="botao-vazado"
          href={WHATSAPP_LINK}
          target="_blank"
          rel="noreferrer"
        >
          Só quero conversar sobre orçamento
        </a>
      </div>

      <div className="contato-diretos">
        <span className="contato-numero">{WHATSAPP_EXIBICAO}</span>
        <a className="contato-email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </div>

      <p className="contato-nota">
        Na demonstração você me diz o nome e o segmento do seu negócio, e eu
        te mando <strong>de graça, sem compromisso</strong>, um exemplo real
        de como o seu site ficaria. Se preferir, é só chamar pra conversar
        sobre orçamento ou sobre uma mudança no site que você já tem.
      </p>
    </section>
  )
}
