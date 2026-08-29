import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';

const PRODUCTION_SITE_URL = 'https://eco-mind-myanmar.vercel.app';

function htmlSiteUrl(siteUrl: string): Plugin {
  const origin = siteUrl.replace(/\/$/, '');
  return {
    name: 'html-site-url',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', origin);
    },
  };
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, path.resolve(__dirname), 'VITE_');
  const siteUrl = env.VITE_SITE_URL || (mode === 'production' ? PRODUCTION_SITE_URL : '');
  return {
    plugins: [htmlSiteUrl(siteUrl), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
