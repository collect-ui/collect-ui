import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from "vite-plugin-commonjs"
export default defineConfig({
    plugins: [react(),commonjs()],
    base: '/collect-ui/',
    css: {
        preprocessorOptions: {
            scss: {

            },
        },
    },
    build: {
        lib: {
            entry: './src/index.tsx',
            name: 'CollectUI',
            fileName: (format) => `collect-ui.${format}.js`,
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
    server: {
        port: 3000,
        open: '/',
    },
});