import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Fontes self-hosted (sem depender do Google no ar):
// Inter no eixo de peso; Archivo com o eixo de LARGURA (wdth),
// que é o que permite o font-stretch expandido dos títulos.
import '@fontsource-variable/inter'
import '@fontsource-variable/archivo/wdth.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/hero.css'
import './styles/manifesto.css'
import './styles/projetos.css'
import './styles/secoes.css'
import './styles/cursor.css'

import App from './App'
import { iniciarCarregamento } from './carregamento'

// Antes de montar: avisa a tela de abertura que o bundle chegou e manda
// buscar o resto (fontes, capas). O véu em si já está na tela desde o
// primeiro quadro — quem o desenha é o index.html.
iniciarCarregamento()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
