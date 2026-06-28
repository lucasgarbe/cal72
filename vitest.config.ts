import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: resolve('./src/lib'),
			$env: resolve('./.svelte-kit/types/$env')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		setupFiles: ['./src/test/setup.ts'],
		globals: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			include: ['src/**/*.{js,ts,svelte}'],
			exclude: ['src/test/**', 'src/**/*.d.ts', 'src/**/*.spec.ts', 'src/**/*.test.ts']
		}
	}
});
