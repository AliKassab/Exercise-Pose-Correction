// Copies the MediaPipe WASM runtime out of node_modules into public/wasm so the
// deployed site serves it itself, pinned to the installed package version,
// rather than depending on a CDN staying up.

import { cp, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'node_modules/@mediapipe/tasks-vision/wasm');
const destination = resolve(root, 'public/wasm');

await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });

const copied = await readdir(destination);
console.log(`copy-wasm: ${copied.length} files -> public/wasm`);
