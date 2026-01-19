import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig(({ command }) => ({
    plugins: [sveltekit()],
    ...(command === 'serve' && {
        server: {
            https: {
                key: fs.readFileSync('./ssl/key.pem'),
                cert: fs.readFileSync('./ssl/cert.pem')
            },
            host: true
        }
    })
}));
