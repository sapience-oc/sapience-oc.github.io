import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: "base" precisa ser o nome do seu repositorio no GitHub,
// entre barras. Ex: se o repo e github.com/seu-usuario/sapience-app,
// base deve ser '/sapience-app/'.
// Se o repo se chamar "seu-usuario.github.io" (site principal), use base: '/'
export default defineConfig({
  plugins: [react()],
  base: '/sapience-app/',
})
