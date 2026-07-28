// ============================================================
// CARDS DE PROJETO — fragment shader
// Mostra a screenshot do site. Durante o movimento a imagem
// "escorre" alguns pixels e o vinco do arco escurece de leve —
// é o que faz o card parecer material, não um <img> deslizando.
// ============================================================

uniform sampler2D uMapa; // a capa (screenshot JPEG do site real)
uniform float uCurva;    // mesma curvatura do vertex shader

varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Mesmo arco do vertex (0 nas bordas, 1 no centro): a imagem
  // desliza na direção do movimento só no miolo — as bordas ficam
  // presas, então o recorte nunca rasga.
  float arco = sin(vUv.x * 3.1416);
  uv.x -= uCurva * 0.025 * arco;

  vec3 cor = texture2D(uMapa, uv).rgb;

  // Escurece o vinco enquanto o card está torto — leitura de volume.
  cor *= 1.0 - abs(uCurva) * 0.18 * arco;

  gl_FragColor = vec4(cor, 1.0);
}
