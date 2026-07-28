// ============================================================
// FITA CROMADA — fragment shader
// Roda uma vez POR PIXEL da fita. Nenhuma textura: o "estúdio"
// refletido no metal é desenhado por matemática — três luzes
// falsas em posições fixas, lidas através do vetor de reflexão.
// Custo: ~zero (sem lookup de textura, sem loop).
// ============================================================

uniform vec3 uCorClara;   // champanhe claro — onde a luz bate
uniform vec3 uCorEscura;  // bronze profundo — onde não bate
uniform vec2 uMouse;      // desloca as luzes laterais (efeito sutil)
uniform float uSair;      // 0 = em cena · 1 = invisível (vitrine chegou)

varying vec3 vNormalV;
varying vec3 vPosV;
varying vec2 vUv;

void main() {
  // A interpolação entre vértices "encolhe" a normal — renormaliza.
  vec3 N = normalize(vNormalV);

  // A fita tem dois lados; no verso a normal aponta pro lado errado.
  if (!gl_FrontFacing) N = -N;

  // V = direção deste pixel ATÉ a câmera. Em espaço de câmera ela
  // está na origem, então basta negar a posição.
  vec3 V = normalize(-vPosV);

  // R = pra onde o olhar "quica" na superfície. Este é O truque do
  // cromo: em vez de perguntar "que cor é a superfície", perguntamos
  // "o que ela está REFLETINDO agora".
  vec3 R = reflect(-V, N);

  // ---- O ESTÚDIO FALSO (3 luzes desenhadas com smoothstep) --------
  // Luz 1 — softbox de cima. R.y vai de -1 (chão) a +1 (teto);
  // remapeado pra 0..1, o smoothstep só acende quando o reflexo
  // aponta bem pra cima. Borda macia = metal polido, não espelho duro.
  float luzTopo = smoothstep(0.55, 0.95, R.y * 0.5 + 0.5);

  // Luz 2 — tiras verticais laterais. O seno repete faixas ao longo
  // de R.x; o mouse desloca a FASE: mover o mouse faz os brilhos
  // deslizarem pela fita (o "reativo só dentro da cena").
  float luzLados = smoothstep(0.70, 1.0, abs(sin((R.x + uMouse.x * 0.4) * 3.5)));

  // Luz 3 — rebatida fraca vinda do chão, pra sombra não morrer preta.
  float luzChao = smoothstep(0.85, 1.0, -R.y);

  float luz = luzTopo + luzLados * 0.55 + luzChao * 0.2;

  // ---- FRESNEL ------------------------------------------------------
  // Física real: qualquer superfície reflete mais vista de raspão.
  // dot(N,V) = 1 de frente, 0 de raspão; elevar ao cubo concentra o
  // efeito na borda. É isso que desenha o aro de luz no contorno.
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);

  // ---- COR FINAL -----------------------------------------------------
  // Escuro → claro conforme a luz; o fresnel soma champanhe na borda.
  vec3 cor = mix(uCorEscura, uCorClara, clamp(luz, 0.0, 1.0));
  cor += uCorClara * fresnel * 0.35;

  // Sombreado leve através da LARGURA (vUv.y): vinca o volume da fita.
  cor *= 0.85 + 0.15 * vUv.y;

  // O alpha cai conforme a vitrine de projetos toma a cena
  gl_FragColor = vec4(cor, 1.0 - uSair);
}
