import { useEffect, useRef } from 'react'
import { gsap } from '../anim/scroll'

const SERVICOS = [
  {
    nome: 'Site sob medida',
    texto:
      'Design próprio, texto que vende e construção completa — feito pra converter visita em contato.',
  },
  {
    nome: 'Painel do cliente',
    texto:
      'Acompanhe os contatos que o site gera e edite o essencial sem depender de ninguém.',
  },
  {
    nome: 'Gestão de Google Ads',
    nota: 'módulo opcional',
    texto:
      'Campanhas pra colocar o site na frente de quem já está procurando. Contratado à parte, quando fizer sentido.',
  },
]

export default function Servicos({ movimentoReduzido }) {
  const secao = useRef(null)

  useEffect(() => {
    if (movimentoReduzido) return undefined

    const contexto = gsap.context(() => {
      gsap.from('.servico', {
        y: 26,
        autoAlpha: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: secao.current,
          start: 'top 72%',
          once: true, // entrada é apresentação; não precisa repetir
        },
      })
    }, secao)

    return () => contexto.revert()
  }, [movimentoReduzido])

  return (
    <section className="servicos" ref={secao} aria-label="Serviços">
      <span className="rotulo">Serviços</span>
      <ul>
        {SERVICOS.map((servico) => (
          <li className="servico" key={servico.nome}>
            <strong>{servico.nome}</strong>
            {servico.nota && <i className="servico-nota">{servico.nota}</i>}
            <p>{servico.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
