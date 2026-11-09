import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// The résumé download only renders as a link when the PDF is actually shipped.
const resumeAvailable = fs.existsSync(
  path.resolve(import.meta.dirname, 'public/Srikar-Mattegunta-Resume.pdf'),
)

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  define: {
    __RESUME_AVAILABLE__: JSON.stringify(resumeAvailable),
  },
  resolve: {
    alias: { '@': path.resolve(import.meta.dirname, './src') },
  },
})
