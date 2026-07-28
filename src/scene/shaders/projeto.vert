// ============================================================
// CARDS DE PROJETO — vertex shader
// Cada card é um plano 1x1 que o JS escala pro tamanho exato do
// retângulo DOM correspondente. Aqui ele entorta conforme a
// velocidade do scroll: parado é uma foto, rolando é líquido.
// ============================================================

uniform float uCurva; // -1..1 — velocidade do scroll, suavizada e limitada

varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;

  // sin(uv.x·π) vale 0 nas bordas e 1 no centro: a deformação é um
  // arco — as bordas do card ficam presas no lugar e o miolo cede.
  float arco = sin(uv.x * 3.1416);

  // O centro afunda pra DENTRO da tela, proporcional à velocidade.
  // abs(): afunda igual rolando pra frente ou pra trás.
  p.z -= arco * abs(uCurva) * 0.16;

  // Cisalhamento sutil no sentido do movimento: topo e base se
  // deslocam em direções opostas — sensação de arrasto do metal.
  p.x += (uv.y - 0.5) * uCurva * 0.05;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
