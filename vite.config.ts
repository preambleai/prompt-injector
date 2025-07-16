import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/store': path.resolve(__dirname, './src/store'),
      'litellm': path.resolve(__dirname, './__DO_NOT_IMPORT_LITELLM__'),
      'cohere-ai': path.resolve(__dirname, './__DO_NOT_IMPORT_COHERE_AI__'),
      'src/services/ai-api-integration.ts': path.resolve(__dirname, './__DO_NOT_IMPORT_AI_API_INTEGRATION__')
    }
  },
  optimizeDeps: {
    exclude: ['litellm', 'cohere-ai', 'src/services/ai-api-integration.ts'],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: ['litellm', 'cohere-ai', 'src/services/ai-api-integration.ts'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@headlessui/react', 'lucide-react', 'framer-motion'],
          charts: ['recharts'],
          forms: ['react-hook-form']
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    port: 4173,
    host: true
  }
}) 