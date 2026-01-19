import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		// set https to false to disable ssl locally
		// https: false,
		https: {
			key: fs.readFileSync('./ssl/key.pem'),
			cert: fs.readFileSync('./ssl/cert.pem')
		},
		host: true
	}	
});
