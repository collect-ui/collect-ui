import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from "vite-plugin-commonjs"


export default defineConfig({
    plugins: [react(),commonjs()],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
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
        minify: 'esbuild', // 使用 esbuild 进行压缩
        sourcemap: false, // 禁用 Source Map
    },
    server: {
        port: 3000,
        open: '/',
    },
});