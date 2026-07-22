import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as {
    version: string;
};

/** Short commit SHA of the build, so the deployed page is traceable to a commit. */
function resolveCommit(): string {
    // Set by GitHub Actions; the checkout there may not carry full git history.
    const fromCi = process.env.GITHUB_SHA;
    if (fromCi) {
        return fromCi.slice(0, 7);
    }

    try {
        return execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
            .toString()
            .trim();
    } catch {
        return 'local';
    }
}

// Served from https://www.alikassab.dev/Exercise-Pose-Correction/, so assets
// must be requested from that sub-path rather than the domain root.
export default defineConfig({
    base: '/Exercise-Pose-Correction/',
    plugins: [react(), tailwindcss()],
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __APP_COMMIT__: JSON.stringify(resolveCommit()),
        __APP_BUILT_AT__: JSON.stringify(new Date().toISOString().slice(0, 10))
    }
});
