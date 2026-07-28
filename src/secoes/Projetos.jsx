import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../anim/scroll'
import { projetos } from '../data/projetos'
import { registroVisuais } from '../scene/registroVisuais'
import { suportaWebGL } from '../scene/CenaPrincipal'
import useConsultaMidia, { DESKTOP } from '../hooks/useConsultaMidia'

// Tamanho intrínseco das capas geradas por `fotografar.mjs`. Vai nos
// atributos width/height da <img> pro navegador reservar o espaço antes
// do download e não empurrar o layout quando a imagem chega.
const CAPA_L = 1424
const CAPA_A = 805

export default function Projetos({ movimentoReduzido }) {
  const secao = useRef(null)
  const trilho = useRef(null)
  const progresso = useRef(null)
  const dica = useRef(null)

  const desktop = useConsultaMidia(DESKTOP)

  // Modo simples (lista vertical, sem viagem nenhuma): pra quem pediu menos
  // movimento ou não tem WebGL. Vale em qualquer largura e ganha dos outros.
  const simples = movimentoReduzido || !suportaWebGL()

  // Carrossel nativo: celular e tablet. A página rola normal; quem desliza
  // é só o trilho, e só se o dedo quiser.
  const carrossel = !simples && !desktop

  // O pin (e portanto o plano WebGL em cima do card) é exclusividade do
  // desktop. É esta a variável que liga/desliga o efeito inteiro.
  const comPin = desktop && !simples

  const [ativo, setAtivo] = useState(0)

  // --- DESKTOP: pin + viagem horizontal (comportamento original) ---------
  useEffect(() => {
    if (!comPin) return undefined

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

    return () => {
      // revert() mata o ScrollTrigger E devolve o transform do trilho ao
      // estado original — sem isso, ao estreitar a janela o trilho ficaria
      // preso num translateX de milhares de pixels dentro do carrossel.
      contexto.revert()

      // O revert não alcança estes dois: foram escritos direto no style do
      // elemento dentro do onUpdate, depois que o contexto já tinha fechado
      // a coleta. Sem limpar, a dica "deslize →" nasceria com opacity: 0 no
      // carrossel caso a viagem tivesse passado dos 75% antes do resize.
      if (dica.current) dica.current.style.opacity = ''
      if (progresso.current) progresso.current.style.transform = ''
    }
  }, [comPin])

  // --- Trocou de modo: as outras seções precisam remedir --------------
  // Sair do pin muda a altura da página em ~3 telas de uma vez. Sem este
  // refresh, os gatilhos do manifesto e da fita ficam com as marcas do
  // layout antigo e disparam na hora errada.
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [comPin])

  // --- MOBILE: qual card está no meio, pros pontinhos -------------------
  // IntersectionObserver em vez de listener de scroll: o navegador avisa
  // quando o card entra, não a cada pixel de rolagem do dedo.
  useEffect(() => {
    if (!carrossel || !trilho.current) return undefined

    const pista = trilho.current
    const cards = Array.from(pista.children)

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) setAtivo(cards.indexOf(entrada.target))
        })
      },
      { root: pista, threshold: 0.6 }
    )

    cards.forEach((card) => observador.observe(card))
    return () => observador.disconnect()
  }, [carrossel])

  const irPara = (i) => {
    // block: 'nearest' é essencial — sem ele o navegador também rola a
    // PÁGINA pra centralizar o card na vertical, e o toque no pontinho
    // dá um solavanco pra cima.
    trilho.current?.children[i]?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    })
  }

  return (
    <section
      className={`projetos${simples ? ' projetos--simples' : ''}${
        carrossel ? ' projetos--carrossel' : ''
      }`}
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
          {carrossel ? 'deslize' : 'continue rolando'} <b>→</b>
        </span>

        <div
          className="projetos-trilho"
          ref={trilho}
          // Lenis não deve tocar no que acontece dentro do carrossel: o
          // trilho tem rolagem própria e é o navegador quem manda nela.
          {...(carrossel ? { 'data-lenis-prevent': '' } : {})}
        >
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
                  // Só o desktop registra: é lá que existe plano WebGL pra
                  // se posicionar em cima deste retângulo.
                  if (el && comPin) registroVisuais.set(p.slug, el)
                  else registroVisuais.delete(p.slug)
                }}
              >
                {/* A imagem real mora no DOM (leitor de tela, SEO e
                    fallback); com WebGL ativo quem aparece é o plano 3D
                    posicionado exatamente em cima dela. No carrossel não
                    há plano — esta <img> é a que o visitante vê. */}
                <img
                  src={p.capa}
                  alt={`Site ${p.nome} — ${p.segmento}`}
                  width={CAPA_L}
                  height={CAPA_A}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <span className="projeto-legenda">
                <strong>{p.nome}</strong>
                <span>{p.segmento}</span>
                <em>{String(i + 1).padStart(2, '0')}</em>
              </span>
            </a>
          ))}
        </div>

        {/* Pontinhos: só no carrossel, e só pra dizer "tem mais pro lado".
            São botões de verdade (24px de alvo) — dá pra tocar e navegar. */}
        {carrossel && (
          <div className="projetos-pontos">
            {projetos.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                className={`projetos-ponto${i === ativo ? ' e-ativo' : ''}`}
                aria-label={`Ver ${p.nome}`}
                aria-current={i === ativo ? 'true' : undefined}
                onClick={() => irPara(i)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
