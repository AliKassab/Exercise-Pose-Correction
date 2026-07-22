# Exercise Pose Correction

A real-time exercise form correction application that uses computer vision and pose detection to help users maintain proper form while exercising. The application provides instant feedback on exercise technique using your webcam.

It ships in two forms:

- **Web version** (`src/`) — a React + TypeScript single-page app that runs MediaPipe Tasks Vision entirely in the browser, using the visitor's own camera. This is what gets hosted, live at <https://www.alikassab.dev/Exercise-Pose-Correction>.
- **Desktop version** (`main.py`, `templates/desktop.html`) — the original Flask + OpenCV app, which captures the camera of the machine running it.

## Features

- **Real-time Pose Detection**: Uses MediaPipe to track body movements through your webcam
- **Exercise Form Correction**: Provides instant feedback on exercise technique
- **Multiple Exercise Support**: Currently supports:
  - Squats
  - Left Bicep Curls
  - Right Bicep Curls
  - Push-ups
- **Web-based Interface**: Easy-to-use web interface accessible through your browser
- **Visual Feedback**: Real-time overlay on video feed showing pose landmarks and correction guidance

## Technologies Used

**Web version**

- **React 19 + TypeScript** — component UI, with the pose pipeline isolated in a hook
- **Vite** — dev server and production build
- **Tailwind CSS** — styling
- **MediaPipe Tasks Vision** — pose detection in WebAssembly with a GPU delegate
- **GitHub Actions + GitHub Pages** — build and deploy on every push to `main`

**Desktop version**

- **Python / Flask** — local server and MJPEG stream
- **OpenCV** — video capture and frame processing
- **MediaPipe / NumPy** — pose detection and landmark maths

## Prerequisites

- Node.js 20 or higher, for the web version
- Python 3.7 or higher and pip, for the desktop version
- A working webcam

## Installation

Clone the repository:

```bash
git clone https://github.com/AliKassab/Exercise-Pose-Correction.git
```

For the web version, install the Node dependencies:

```bash
npm install
```

For the desktop version, install the Python dependencies:

```bash
pip install flask flask-cors opencv-python mediapipe numpy
```

## Usage (desktop version)

Note that `main.py` reads the camera of the machine it runs on, which is why the hosted
site uses the React build instead.

1. Run the application:
   ```bash
   python main.py
   ```

2. Open your web browser and navigate to:
   ```
   http://127.0.0.1:5000/
   ```

3. Click the **"Start Video Feed"** button to activate your webcam

4. Select an exercise from the dropdown menu:
   - Squat
   - Left Bicep Curl
   - Right Bicep Curl
   - Push Up

5. Follow the on-screen instructions and corrections to improve your form

6. Have fun exercising! 😊

## Web Version (hosted)

A React single-page app; every frame is processed on the visitor's device, and no video
is uploaded anywhere.

```bash
npm install
npm run dev
```

The dev server prints a URL under `/Exercise-Pose-Correction/`, matching the sub-path the
site is deployed to. A camera requires a secure context, so this works on `localhost` and
over HTTPS, but not from a `file://` path.

Other scripts:

| Script | Purpose |
| --- | --- |
| `npm run build` | Type-check, copy the WASM runtime, and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |

### Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and publishes on every push to `main`. Under
**Settings → Pages**, the source must be set to **GitHub Actions**.

`vite.config.ts` sets `base` to `/Exercise-Pose-Correction/`, since the site is served
from a sub-path rather than a domain root.

The MediaPipe WASM runtime is copied out of `node_modules` into `public/wasm/` at build
time, so the deployed site serves it itself, version-locked to the installed package,
instead of depending on a CDN. Only the model file is fetched from Google's bucket.

### Web version structure

```
index.html                     # Vite entry point
src/
├── main.tsx                   # React root
├── App.tsx                    # Page layout and exercise selection state
├── components/                # CameraStage, ExerciseControls, StatusMessage
├── hooks/
│   └── usePoseCorrection.ts   # Camera, landmarker and render loop (replaces main.py)
└── lib/
    ├── angleCalculator.ts     # Port of AngleCalculator.py
    ├── landmarks.ts           # Pose landmark indices
    ├── types.ts               # Landmark and strategy interfaces
    └── strategies/            # Ports of the four exercise strategies
```

The render loop deliberately lives outside React state: it runs at frame rate, and
re-rendering per frame would be wasteful. The selected exercise is mirrored into a ref so
switching exercises does not restart the loop.

The strategy ports are behaviourally identical to the Python originals: across 200
randomized landmark sets, all four strategies produce byte-identical guidance text in
both implementations.

## How It Works

The application uses the Strategy design pattern to implement different exercise correction algorithms:

1. **PoseDetector**: Captures video from your webcam and processes each frame using MediaPipe
2. **Exercise Strategies**: Each exercise has its own strategy class that analyzes body landmarks and angles
3. **Form Correction**: The system calculates angles between key body points and provides real-time feedback
4. **Visual Feedback**: Correction guidance is displayed directly on the video feed

## Project Structure (desktop version)

```
Exercise-Pose-Correction/
├── main.py                      # Flask application and main entry point
├── templates/desktop.html       # Desktop app's web interface
├── PoseDetector.py              # Pose detection using MediaPipe
├── AngleCalculator.py           # Utility for calculating body angles
├── ExerciseAnalysisStrategy.py  # Abstract base class for exercise strategies
├── SquatStrategy.py             # Squat form correction
├── LeftBicepCurlStrategy.py     # Left bicep curl form correction
├── RightBicepCurlStrategy.py    # Right bicep curl form correction
└── PushUpStrategy.py            # Push-up form correction
```

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the application.

## License

This project is open source and available for educational and personal use.

## Acknowledgments

- Built with [MediaPipe](https://mediapipe.dev/) by Google
- Pose detection powered by state-of-the-art machine learning models
