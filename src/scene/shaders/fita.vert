// ============================================================
// FITA CROMADA — vertex shader
// Roda uma vez POR VÉRTICE da malha (o plano tem 220x24 divisões).
// Trabalho dele: torcer o plano em fita, ondular como pano pesado
// e entregar ao fragment shader a normal (direção da superfície)
// já corrigida — é dela que o reflexo do cromo depende.
// ============================================================

uniform float uTempo;   // segundos desde o início (o useFrame soma delta)
uniform float uScroll;  // progresso do scroll no hero, 0 → 1, já suavizado
uniform vec2  uMouse;   // mouse em -1..1, já com atraso (lerp feito no JS)

varying vec3 vNormalV;  // normal em espaço de câmera → vai pro fragment
varying vec3 vPosV;     // posição em espaço de câmera → vai pro fragment
varying vec2 vUv;       // coordenada 0..1 dentro da fita (x = comprimento)

void main() {
  vUv = uv;
  vec3 p = position;

  // ---- 1. TORÇÃO ------------------------------------------------
  // uv.x diz onde estamos no comprimento (0 = uma ponta, 1 = outra).
  // (uv.x - 0.5) centraliza: o meio não gira, as pontas giram em
  // sentidos opostos. O scroll SUBTRAI torção (3.2 → 1.0 rad):
  // rolar a página literalmente desenrola a fita.
  float angulo = (uv.x - 0.5) * (3.2 - uScroll * 2.2);

  // Giro lento constante, pra fita nunca ficar morta parada.
  angulo += uTempo * 0.15;

  // Rotação 2D no plano y/z = torcer ao redor do eixo do comprimento.
  float c = cos(angulo);
  float s = sin(angulo);
  p.yz = mat2(c, -s, s, c) * p.yz;

  // ---- 2. ONDULAÇÃO ----------------------------------------------
  // Duas senoides somadas com frequências diferentes = movimento
  // orgânico (uma só parece pêndulo de relógio).
  // 6.2832 = 2π → exatamente um ciclo ao longo do comprimento.
  float onda = sin(uv.x * 6.2832 + uTempo * 0.6) * 0.18
             + sin(uv.x * 12.566 - uTempo * 0.4) * 0.05;

  // A ponta (uv.x → 1) balança mais que a base, como pano preso
  // por uma das extremidades.
  p.y += onda * (0.3 + 0.7 * uv.x);

  // ---- 3. MOUSE (o único lugar onde ele age) ----------------------
  // sin(uv.x·π) vale 0 nas pontas e 1 no meio: o empurrão do mouse
  // curva o miolo da fita sem arrancar as extremidades do lugar.
  float miolo = sin(uv.x * 3.1416);
  p.y += uMouse.y * 0.12 * miolo;
  p.z += uMouse.x * 0.10 * miolo;

  // ---- 4. NORMAL ---------------------------------------------------
  // A normal precisa girar JUNTO com a torção, senão o reflexo fica
  // "colado" na posição antiga e o cromo quebra. (A ondulação não
  // recalcula normal: a diferença é invisível aqui e custaria caro.)
  vec3 n = normal;
  n.yz = mat2(c, -s, s, c) * n.yz;

  // ---- 5. PROJEÇÃO (o caminho padrão de todo vertex shader) --------
  vec4 posCamera = modelViewMatrix * vec4(p, 1.0); // objeto → câmera
  vPosV = posCamera.xyz;
  vNormalV = normalize(normalMatrix * n);          // normal → câmera
  gl_Position = projectionMatrix * posCamera;      // câmera → tela
}
