import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

// glsl() permite importar arquivos .vert/.frag como string:
//   import fragmento from './shaders/fita.frag'
// Sem ele, shader teria que viver como template string dentro do JS.
export default defineConfig({
  plugins: [react(), glsl()],
})
