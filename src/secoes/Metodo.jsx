import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../anim/scroll'

const PASSOS = [
  {
    titulo: 'Conversa e diagnóstico',
    texto:
      'Entendo o negócio, quem é o cliente e o que precisa acontecer: vender mais, agendar mais, ser encontrado.',
  },
  {
    titulo: 'Design sob medida',
    texto:
      'Desenho o site do zero — nada de template. Cada seção existe pra levar o visitante até o contato.',
  },
  {
    titulo: 'Construção e velocidade',
    texto:
      'Código leve, rápido no celular e pronto pro Google. O site carrega antes do cliente desistir.',
  },
  {
    titulo: 'Painel e acompanhamento',
    texto:
      'Você enxerga os contatos que o site gera no painel do cliente, e o site evolui junto com o negócio.',
  },
]

export default function Metodo({ movimentoReduzido }) {
  const secao = useRef(null)

  useEffect(() => {
    if (movimentoReduzido) return undefined

    const contexto = gsap.context(() => {
      // Cada passo "acende" enquanto cruza a faixa central da tela
      // (e apaga de volta se rolar pra cima — o scroll é quem comanda)
      secao.current.querySelectorAll('.metodo-passo').forEach((passo) => {
        ScrollTrigger.create({
          trigger: passo,
          start: 'top 70%',
          end: 'bottom 35%',
          toggleClass: 'ativo',
        })
      })
    }, secao)

    return () => contexto.revert()
  }, [movimentoReduzido])

  return (
    <section className="metodo" ref={secao} aria-label="Como funciona">
      <div className="metodo-intro">
        <span className="rotulo">Como funciona</span>
        <h2>Do primeiro oi ao site no ar</h2>
        <p>
          Um processo direto, com uma pessoa só do começo ao fim — sem
          telefone sem fio entre designer, programador e atendente.
        </p>
      </div>

      <ol className="metodo-passos">
        {PASSOS.map((passo, i) => (
          <li className="metodo-passo" key={passo.titulo}>
            <em>{String(i + 1).padStart(2, '0')}</em>
            <div>
              <h3>{passo.titulo}</h3>
              <p>{passo.texto}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
