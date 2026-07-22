import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Served from https://www.alikassab.dev/Exercise-Pose-Correction/, so assets
// must be requested from that sub-path rather than the domain root.
export default defineConfig({
    base: '/Exercise-Pose-Correction/',
    plugins: [react(), tailwindcss()]
});
