import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import commonjs from "vite-plugin-commonjs";

export default defineConfig({
    plugins: [react(), commonjs()],
    base: '/collect-ui/',
    build: {
        outDir: 'docs', // 输出目录
        rollupOptions: {
            output:{
                entryFileNames: `assets/[name].js`,
                chunkFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
            input: './index.html', // 入口文件
        },
    },
});