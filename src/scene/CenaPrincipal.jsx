import { useEffect, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import FitaCromada from './FitaCromada'
import PlanosProjetos from './PlanosProjetos'
import useConsultaMidia, { TELA_ESTREITA, DESKTOP } from '../hooks/useConsultaMidia'
import { marcarEtapa } from '../carregamento'

// Detecção honesta: se o aparelho não cria contexto WebGL, nem tentamos —
// o fallback é um brilho champanhe em CSS puro (.cena-fallback).
// Exportada: a seção de projetos usa a mesma resposta pra decidir
// entre planos 3D e <img> comuns.
export function suportaWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function CenaPrincipal({ movimentoReduzido }) {
  // Hooks antes do return condicional: a ordem dos hooks não pode variar.
  const estreita = useConsultaMidia(TELA_ESTREITA)
  const desktop = useConsultaMidia(DESKTOP)
  // memo: a resposta não muda no meio da sessão, e cada chamada criava
  // um <canvas> descartável a mais por render
  const temWebGL = useMemo(() => suportaWebGL(), [])

  // Sem WebGL não existe "primeiro quadro" pra tela de carregamento
  // esperar — a etapa se dá por cumprida na hora.
  useEffect(() => {
    if (!temWebGL) marcarEtapa('cena')
  }, [temWebGL])

  if (!temWebGL) {
    return <div className="cena-fallback" aria-hidden="true" />
  }

  return (
    // aria-hidden + pointer-events:none (no CSS): o canvas é decorativo —
    // leitor de tela não o anuncia e o mouse atravessa até o conteúdo.
    <div className="cena" aria-hidden="true">
      <Canvas
        // teto de pixel ratio 2: em telas 3x renderizar nativo é pagar
        // 2,25x mais pixels por nitidez que ninguém percebe em movimento.
        // No celular o teto cai pra 1,5: metade dos pixels do teto 2, e é
        // ali que a GPU é fraca e o shader da fita pesa.
        dpr={[1, estreita ? 1.5 : 2]}
        // o contexto WebGL nasceu: é a etapa "cena" da tela de carregamento
        onCreated={() => marcarEtapa('cena')}
        // flat = sem tone mapping; as cores do shader saem como escolhemos
        flat
        camera={{ fov: 32, position: [0, 0, 6] }}
        // com movimento reduzido: renderiza 1 frame e dorme ('demand')
        frameloop={movimentoReduzido ? 'demand' : 'always'}
        gl={{
          antialias: true,
          alpha: true, // canvas transparente: o fundo é o CSS (--fundo)
          powerPreference: 'high-performance',
        }}
      >
        <FitaCromada estatica={movimentoReduzido} />
        {/* Os planos só existem no desktop. Com movimento reduzido a vitrine
            vira lista vertical, e no celular vira carrossel nativo: nos dois
            casos quem mostra a capa é a <img> do DOM, não um plano 3D.
            Não montar aqui economiza 6 texturas na GPU justamente onde ela
            é fraca — e evita o plano descolar da imagem durante o momentum
            scroll do iOS, em que o rAF não acompanha o dedo. */}
        {!movimentoReduzido && desktop && <PlanosProjetos />}
      </Canvas>
    </div>
  )
}
