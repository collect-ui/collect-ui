import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {

            },
        },
    },
    build: {
        lib: {
            entry: './src/index.js',
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
        open: '/index.html',
    },
});