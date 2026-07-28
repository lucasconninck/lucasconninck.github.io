import { Canvas } from '@react-three/fiber'
import FitaCromada from './FitaCromada'
import PlanosProjetos from './PlanosProjetos'

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
  if (!suportaWebGL()) {
    return <div className="cena-fallback" aria-hidden="true" />
  }

  return (
    // aria-hidden + pointer-events:none (no CSS): o canvas é decorativo —
    // leitor de tela não o anuncia e o mouse atravessa até o conteúdo.
    <div className="cena" aria-hidden="true">
      <Canvas
        // teto de pixel ratio 2: em telas 3x renderizar nativo é pagar
        // 2,25x mais pixels por nitidez que ninguém percebe em movimento
        dpr={[1, 2]}
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
        {/* com movimento reduzido os cards viram <img> no DOM — sem planos */}
        {!movimentoReduzido && <PlanosProjetos />}
      </Canvas>
    </div>
  )
}
