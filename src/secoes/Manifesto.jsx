import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, progressoRolagem } from '../anim/scroll'

const FRASE =
  'A internet é a vitrine do seu negócio. Se ela não representa a qualidade da sua empresa, você está perdendo oportunidades todos os dias.'

export default function Manifesto({ movimentoReduzido }) {
  const secao = useRef(null)

  useEffect(() => {
    if (movimentoReduzido) return undefined

    const contexto = gsap.context(() => {
      // A fita cromada se despede AQUI, durante o manifesto — bem antes
      // da vitrine de projetos entrar na tela. (Antes isso ficava na seção
      // de projetos e a fita atravessava os cards: bug relatado pelo Lucas.)
      ScrollTrigger.create({
        trigger: secao.current,
        start: 'center 65%',
        end: 'bottom 80%',
        onUpdate: (gatilho) => {
          progressoRolagem.sair = gatilho.progress
        },
      })

      // scrub: a animação não roda no tempo, roda NO SCROLL —
      // cada palavra acende conforme a frase cruza o meio da tela,
      // e apaga de volta se você rolar pra cima. O scroll é a timeline.
      gsap.to(secao.current.querySelectorAll('.palavra'), {
        opacity: 1,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: {
          trigger: secao.current,
          start: 'top 70%',
          end: 'center 45%',
          scrub: true,
        },
      })
    }, secao)

    return () => contexto.revert()
  }, [movimentoReduzido])

  return (
    <section className="manifesto" ref={secao} aria-label="Manifesto">
      <p>
        {FRASE.split(' ').map((palavra, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <span className="palavra" key={i}>
            {palavra}{' '}
          </span>
        ))}
      </p>
    </section>
  )
}
