import { useEffect, useRef } from 'react'
import { gsap } from '../anim/scroll'
import { projetos } from '../data/projetos'
import { registroVisuais } from '../scene/registroVisuais'
import { suportaWebGL } from '../scene/CenaPrincipal'

export default function Projetos({ movimentoReduzido }) {
  const secao = useRef(null)
  const trilho = useRef(null)
  const progresso = useRef(null)
  const dica = useRef(null)

  // Modo simples (sem pin, imagens direto no DOM, lista vertical):
  // pra quem pediu menos movimento ou não tem WebGL.
  const simples = movimentoReduzido || !suportaWebGL()

  useEffect(() => {
    if (simples) return undefined

    const contexto = gsap.context(() => {
      // A seção tem 380vh de altura; o miolo fica grudado (sticky) na tela
      // enquanto isso, e este tween converte o scroll vertical excedente
      // em viagem horizontal do trilho de cards.
      gsap.to(trilho.current, {
        x: () => -(trilho.current.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: secao.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8, // 0.8s de perseguição: peso de vitrine, não trepidação
          invalidateOnRefresh: true, // recalcula a distância no resize
          onUpdate: (gatilho) => {
            // barra champanhe enche junto com a viagem — o visitante VÊ
            // que está no meio de algo e quanto falta
            gsap.set(progresso.current, { scaleX: gatilho.progress })
            // a dica "continue rolando" some quando já entendeu (75%)
            dica.current.style.opacity = gatilho.progress > 0.75 ? '0' : ''
          },
        },
      })
    }, secao)

    return () => contexto.revert()
  }, [simples])

  return (
    <section
      className={`projetos${simples ? ' projetos--simples' : ''}`}
      ref={secao}
      aria-label="Projetos"
    >
      <div className="projetos-fixo">
        <header className="projetos-cabeca">
          <span>Projetos</span>
          <span>{String(projetos.length).padStart(2, '0')} sites</span>
          {/* a linha de baixo do cabeçalho é o trilho da barra de progresso */}
          <i className="projetos-progresso" ref={progresso} aria-hidden="true" />
        </header>

        <span className="projetos-dica" ref={dica} aria-hidden="true">
          continue rolando <b>→</b>
        </span>

        <div className="projetos-trilho" ref={trilho}>
          {projetos.map((p, i) => (
            <a
              className="projeto"
              key={p.slug}
              href={p.demo}
              target="_blank"
              rel="noreferrer"
            >
              <figure
                className="projeto-visual"
                ref={(el) => {
                  if (el) registroVisuais.set(p.slug, el)
                  else registroVisuais.delete(p.slug)
                }}
              >
                {/* A imagem real mora no DOM (leitor de tela, SEO e
                    fallback); com WebGL ativo quem aparece é o plano 3D
                    posicionado exatamente em cima dela. */}
                <img src={p.capa} alt={`Site ${p.nome} — ${p.segmento}`} loading="lazy" />
              </figure>
              <span className="projeto-legenda">
                <strong>{p.nome}</strong>
                <span>{p.segmento}</span>
                <em>{String(i + 1).padStart(2, '0')}</em>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
