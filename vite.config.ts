import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { networkInterfaces } from 'node:os';

const PORT = 5173;

/**
 * Direcciones IPv4 de la red local de este equipo. Se inyectan en la app para
 * que el Centro QR pueda ofrecer un enlace que funcione desde los celulares
 * conectados al mismo Wi-Fi mientras se ejecuta `npm run dev`.
 */
function lanUrls(): string[] {
  const urls: string[] = [];
  for (const list of Object.values(networkInterfaces())) {
    for (const net of list ?? []) {
      if (net.family === 'IPv4' && !net.internal) urls.push(`http://${net.address}:${PORT}/`);
    }
  }
  return urls;
}

export default defineConfig(({ command }) => ({
  // Rutas relativas: el build funciona en cualquier carpeta o hosting estático.
  base: './',
  plugins: [react()],
  define: {
    __LAN_URLS__: JSON.stringify(command === 'serve' ? lanUrls() : []),
  },
  server: { host: true, port: PORT },
  preview: { host: true, port: 4173 },
}));
