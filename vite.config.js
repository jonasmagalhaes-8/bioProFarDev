import { svelte } from '@sveltejs/vite-plugin-svelte'
import routify from '@roxi/routify/vite-plugin'
import { defineConfig } from 'vite'
import path from 'path'

const production = process.env.NODE_ENV === 'production'

export default defineConfig({
    resolve: {
        conditions: ['browser'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
        },
    },
    clearScreen: false,
    plugins: [
        routify({
            render: {
                // 👇 MUDANÇA AQUI: Force false para não rodar no servidor/build
                ssg: false,
                ssr: false,
            },
        }),
        svelte({
            compilerOptions: {
                dev: !production,
            },
        }),
    ],
    server: {
        port: 1337,
        host: true,
        allowedHosts: [
            'localhost',
            '127.0.0.1',
            'vocal-rarely-treefrog.ngrok-free.app',
        ],
    },
})