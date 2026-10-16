import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild ? undefined : (id: string) => {
          if (id.includes('node_modules/echarts') || id.includes('node_modules/zrender')) return 'charts'
          if (id.includes('node_modules/leaflet') || id.includes('react-leaflet')) return 'map'
        },
      },
    },
  },
}))
