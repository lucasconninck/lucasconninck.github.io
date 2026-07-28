import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { progressoRolagem } from '../anim/scroll'
import vertexShader from './shaders/fita.vert'
import fragmentShader from './shaders/fita.frag'

// Alvo do mouse em coordenadas -1..1 (centro da tela = 0,0).
// Vive FORA do React de propósito: mexer o mouse não pode re-renderizar
// componente nenhum — só o loop do WebGL lê este valor.
const alvoMouse = new THREE.Vector2(0, 0)
window.addEventListener('pointermove', (evento) => {
  alvoMouse.set(
    (evento.clientX / window.innerWidth) * 2 - 1,
    -(evento.clientY / window.innerHeight) * 2 + 1
  )
})

export default function FitaCromada({ estatica = false }) {
  const malha = useRef(null)

  // uniforms são os "fios" que ligam o JS aos shaders — criados uma vez só
  const uniforms = useMemo(
    () => ({
      uTempo: { value: estatica ? 2.4 : 0 }, // 2.4s ≈ um frame bonito da onda
      uScroll: { value: 0 },
      uSair: { value: 0 }, // 0 = em cena · 1 = invisível (projetos chegaram)
      uMouse: { value: new THREE.Vector2(0, 0) },
      uCorClara: { value: new THREE.Color('#F3E7CE') }, // champanhe claro
      uCorEscura: { value: new THREE.Color('#241B10') }, // bronze profundo
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFrame((_, delta) => {
    if (estatica) return

    uniforms.uTempo.value += delta

    // Atraso proposital: o uniform caminha 6% da distância até o alvo por
    // frame. O reflexo "escorre" atrás do mouse em vez de grudar nele —
    // reativo dentro da cena, nunca um elemento perseguindo o cursor.
    uniforms.uMouse.value.lerp(alvoMouse, 0.06)

    // Mesmo tratamento pro scroll: o ScrollTrigger escreve a posição crua,
    // aqui a gente persegue com 8% por frame — a fita desenrola com peso.
    uniforms.uScroll.value +=
      (progressoRolagem.hero - uniforms.uScroll.value) * 0.08

    // Conforme desenrola, a fita sobe e endireita um pouco — ela "viaja"
    // junto com a página em direção à próxima seção.
    const progresso = uniforms.uScroll.value
    malha.current.position.y = -0.15 + progresso * 1.35
    malha.current.rotation.z = -0.38 + progresso * 0.3

    // Saída de cena: a fita esmaece durante o manifesto (o alpha do
    // fragment cai) e, invisível, para de desenhar. Perseguição a 16%
    // por frame: rápida o bastante pra nunca alcançar os cards mesmo
    // num scroll de flick.
    uniforms.uSair.value += (progressoRolagem.sair - uniforms.uSair.value) * 0.16
    malha.current.visible = uniforms.uSair.value < 0.98
  })

  return (
    <mesh ref={malha} position={[0.4, -0.15, 0]} rotation={[0.35, 0.15, -0.38]}>
      {/* plano de 5.2 x 1.15 com 220x24 subdivisões (~10 mil vértices —
          barato) — é o vertex shader que torce isso em fita */}
      <planeGeometry args={[5.2, 1.15, 220, 24]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide} // fita tem frente e verso visíveis
        transparent // permite o esmaecimento de saída (uSair)
      />
    </mesh>
  )
}
