import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {flowPlugin, esbuildFlowPlugin} from '@bunchtogether/vite-plugin-flow';

export default defineConfig({
    jsx: 'react',
    optimizeDeps: {
        esbuildOptions: {
            plugins: [esbuildFlowPlugin()]
        }
    },
    plugins: [
        flowPlugin(),
        react(),
    ],
    rollupOptions: {
        external: ['Q']
    }
})
