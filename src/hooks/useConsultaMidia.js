// Acompanha uma media query em JS e re-renderiza quando ela vira.
//
// Serve pros casos em que CSS sozinho não resolve: mudar o MARKUP conforme a
// largura (o título do hero quebra em 3 linhas no celular e 2 no desktop) ou
// passar um valor pro WebGL (pixel ratio menor em tela pequena).

import { useEffect, useState } from 'react'

// A fronteira "celular" do site. Está repetida no CSS (hero.css, manifesto.css,
// secoes.css) — mexeu aqui, mexa lá: o CSS calibra o tamanho do título pela
// quebra que ESTE valor decide.
export const TELA_ESTREITA = '(max-width: 560px)'

export default function useConsultaMidia(consulta) {
  const [combina, setCombina] = useState(
    () => window.matchMedia(consulta).matches
  )

  useEffect(() => {
    const mq = window.matchMedia(consulta)
    setCombina(mq.matches) // a consulta pode ter mudado entre render e efeito
    const aoMudar = (evento) => setCombina(evento.matches)
    mq.addEventListener('change', aoMudar)
    return () => mq.removeEventListener('change', aoMudar)
  }, [consulta])

  return combina
}
