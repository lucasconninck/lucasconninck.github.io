// Ponte DOM → WebGL da seção de projetos: cada card registra aqui o
// elemento onde a imagem deveria aparecer (slug → elemento), e o plano
// 3D correspondente lê o retângulo dele a cada frame pra se posicionar
// exatamente em cima. O canvas do R3F é outra árvore React — contexto
// não atravessa — então a ponte é um módulo simples.

export const registroVisuais = new Map()
