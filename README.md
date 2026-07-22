# Exercise Pose Correction

Real-time exercise form correction in the browser. Point your webcam at yourself, pick an
exercise, and get instant on-screen guidance on your technique.

**Live at <https://www.alikassab.dev/Exercise-Pose-Correction>**

Pose detection runs entirely on your own device through WebAssembly — no video, no
landmarks and no frames are ever uploaded, and there is no backend to upload them to.

## Features

- **Real-time pose detection** — tracks 33 body landmarks through your webcam
- **Form correction** — instant feedback on your technique, drawn over the video
- **Four exercises** — squat, left bicep curl, right bicep curl, push-up
- **Fully client-side** — static hosting, no server, nothing leaves the browser

## Technologies Used

- **React 19 + TypeScript** — component UI, with the pose pipeline isolated in a hook
- **Vite** — dev server and production build
- **Tailwind CSS** — styling
- **MediaPipe Tasks Vision** — pose detection in WebAssembly with a GPU delegate
- **GitHub Actions + GitHub Pages** — build and deploy on every push to `main`

## Prerequisites

- Node.js 20.19+ or 22.12+ (required by Vite 8)
- A working webcam

## Running locally

```bash
git clone https://github.com/AliKassab/Exercise-Pose-Correction.git
cd Exercise-Pose-Correction
npm install
npm run dev
```

The dev server prints a URL under `/Exercise-Pose-Correction/`, matching the sub-path the
site is deployed to. A camera requires a secure context, so this works on `localhost` and
over HTTPS, but not from a `file://` path.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, copy the WASM runtime, and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |

## Usage

1. Open the site and click **Start Video Feed**, then allow camera access.
   The first load fetches the WASM runtime and the pose model, so give it a few seconds.
2. Pick an exercise from the dropdown.
3. Follow the on-screen corrections.
4. Have fun exercising! 😊

## How It Works

The app uses the Strategy pattern, one class per exercise:

1. **Pose detection** — MediaPipe returns 33 normalized landmarks per frame.
2. **Exercise strategies** — each implements `ExerciseAnalysisStrategy`, reading the
   landmarks it needs and comparing joint angles and distances against target ranges.
3. **Form correction** — anything outside range becomes a line of guidance text.
4. **Visual feedback** — the skeleton and guidance are drawn onto a canvas over the video.

Adding an exercise means writing one strategy class and registering it in
`src/lib/strategies/index.ts`; nothing in the render loop or the UI needs to change.

The render loop deliberately lives outside React state: it runs at frame rate, and
re-rendering per frame would be wasteful. The selected exercise is mirrored into a ref so
switching exercises does not restart the loop.

## Project Structure

```
index.html                     # Vite entry point
src/
├── main.tsx                   # React root
├── App.tsx                    # Page layout and exercise selection state
├── components/                # CameraStage, ExerciseControls, StatusMessage
├── hooks/
│   └── usePoseCorrection.ts   # Camera, landmarker and render loop
└── lib/
    ├── angleCalculator.ts     # Joint angle and distance maths
    ├── landmarks.ts           # Pose landmark indices
    ├── types.ts               # Landmark and strategy interfaces
    └── strategies/            # One class per exercise
scripts/copy-wasm.mjs          # Vendors the MediaPipe runtime into public/wasm
.github/workflows/deploy.yml   # Build and deploy to GitHub Pages
```

## Deployment

`.github/workflows/deploy.yml` type-checks, builds and publishes on every push to `main`.
Under **Settings → Pages**, the source must be set to **GitHub Actions**.

`vite.config.ts` sets `base` to `/Exercise-Pose-Correction/`, since the site is served
from a sub-path rather than a domain root.

It also injects the build stamp shown in the footer: the `version` from `package.json`
plus the short commit SHA, taken from `GITHUB_SHA` in CI and from `git rev-parse` locally.
The SHA links to that commit on GitHub, so a deployed page can always be traced back to
the source it was built from. Bump `version` in `package.json` to change what is shown.

The MediaPipe WASM runtime is copied out of `node_modules` into `public/wasm/` at build
time, so the deployed site serves it itself, version-locked to the installed package,
instead of depending on a CDN. Only the model file is fetched from Google's bucket.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the
application.

## License

This project is open source and available for educational and personal use.

## Acknowledgments

- Built with [MediaPipe](https://mediapipe.dev/) by Google
- Pose detection powered by state-of-the-art machine learning models
