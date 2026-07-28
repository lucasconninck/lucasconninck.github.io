// Lê e acompanha a preferência de sistema "reduzir movimento".
// Quem pediu menos movimento recebe: sem Lenis, sem animação de
// entrada, fita cromada congelada num frame bonito.

import { useEffect, useState } from 'react'

export default function useMovimentoReduzido() {
  const [reduzido, setReduzido] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)')
    const aoMudar = (evento) => setReduzido(evento.matches)
    consulta.addEventListener('change', aoMudar)
    return () => consulta.removeEventListener('change', aoMudar)
  }, [])

  return reduzido
}
