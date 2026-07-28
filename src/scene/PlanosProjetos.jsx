import { Suspense, useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { projetos } from '../data/projetos'
import { progressoRolagem } from '../anim/scroll'
import { registroVisuais } from './registroVisuais'
import vertexShader from './shaders/projeto.vert'
import fragmentShader from './shaders/projeto.frag'

// UMA curvatura compartilhada por todos os cards: os seis materiais
// apontam pro MESMO objeto — atualizar aqui uma vez atualiza todos.
const curva = { value: 0 }

function PlanoProjeto({ projeto }) {
  const malha = useRef(null)

  // useTexture suspende o componente até a capa estar carregada —
  // o mesh só existe quando a textura existe (sem estado "preto").
  const textura = useTexture(projeto.capa)

  // JPEG é sRGB; sem isso as cores saem lavadas. needsUpdate força
  // reenvio à GPU caso ela já tenha subido com o espaço errado.
  if (textura.colorSpace !== THREE.SRGBColorSpace) {
    textura.colorSpace = THREE.SRGBColorSpace
    textura.needsUpdate = true
  }

  // Material construído JÁ com a textura no uniform — nada de setar
  // depois e depender de diffing de props pra chegar no shader.
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
          uMapa: { value: textura },
          uCurva: curva, // referência compartilhada, de propósito
        },
      }),
    [textura]
  )

  useEffect(() => () => material.dispose(), [material])

  useFrame(({ size, viewport }) => {
    const el = registroVisuais.get(projeto.slug)
    const m = malha.current
    if (!m) return
    if (!el) {
      m.visible = false
      return
    }

    const r = el.getBoundingClientRect()

    // Fora da tela: nem desenha (draw call economizado)
    if (r.right < -80 || r.left > size.width + 80) {
      m.visible = false
      return
    }
    m.visible = true

    // Conversão retângulo de tela → mundo 3D: regra de três.
    // viewport.width/height = quantas unidades do mundo cabem na tela
    // na profundidade z=0 (onde os planos vivem).
    m.position.x = ((r.left + r.width / 2) / size.width - 0.5) * viewport.width
    m.position.y = -((r.top + r.height / 2) / size.height - 0.5) * viewport.height
    m.scale.set(
      (r.width / size.width) * viewport.width,
      (r.height / size.height) * viewport.height,
      1
    )
  })

  return (
    <mesh ref={malha} visible={false} material={material}>
      {/* 32x32 divisões: suficiente pro arco ficar liso, barato de animar */}
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  )
}

export default function PlanosProjetos() {
  // A curvatura é atualizada UMA vez por frame, aqui no pai
  useFrame(() => {
    // alvo vem da velocidade do Lenis; clamp evita o card rasgar num flick
    const alvo = THREE.MathUtils.clamp(progressoRolagem.velocidade * 0.018, -1, 1)
    // persegue o alvo com 10% por frame — chega rápido, para macio
    curva.value += (alvo - curva.value) * 0.1
    // decaimento: se o Lenis parar de emitir eventos, a curva zera sozinha
    progressoRolagem.velocidade *= 0.92
  })

  return (
    <Suspense fallback={null}>
      {projetos.map((p) => (
        <PlanoProjeto key={p.slug} projeto={p} />
      ))}
    </Suspense>
  )
}
