import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {flowPlugin, esbuildFlowPlugin} from '@bunchtogether/vite-plugin-flow';
import checker from "vite-plugin-checker";

export default defineConfig({
    jsx: 'react',
    optimizeDeps: {
        esbuildOptions: {
            plugins: [esbuildFlowPlugin()]
        }
    },
    plugins: [
        flowPlugin(),
        checker({typescript: true, eslint: {lintCommand: 'eslint "./src/**/*.{ts,tsx,js,jsx}"'}, overlay: false, terminal: true}),
        react(),
    ],
    server: {
        host: true
    }
})
