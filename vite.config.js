import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://aloncs.github.io/Personal_portfolio_Minimalist-/ — every asset
  // URL needs this prefix. If you move to a custom domain or a user site
  // (aloncs.github.io), change this back to '/'.
  base: '/Personal_portfolio_Minimalist-/',
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
})
