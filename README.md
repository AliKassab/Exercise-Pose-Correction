# Exercise Pose Correction

A real-time exercise form correction application that uses computer vision and pose detection to help users maintain proper form while exercising. The application provides instant feedback on exercise technique using your webcam.

It ships in two forms:

- **Web version** (`index.html`, `css/`, `js/`) — runs entirely in the browser with MediaPipe Tasks Vision. Static files, no server, uses the visitor's own camera. This is what gets hosted, live at <https://www.alikassab.dev/Exercise-Pose-Correction>.
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

- **Python** - Backend server
- **Flask** - Web framework
- **OpenCV** - Computer vision and video processing
- **MediaPipe** - Pose detection and landmark tracking
- **HTML/CSS/JavaScript** - Frontend interface

## Prerequisites

Before running the application, ensure you have the following installed:

- Python 3.7 or higher
- pip (Python package manager)
- A working webcam

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AliKassab/Exercise-Pose-Correction.git
   cd Exercise-Pose-Correction
   ```

2. Install the required dependencies:
   ```bash
   pip install flask flask-cors opencv-python mediapipe numpy
   ```

## Usage (desktop version)

Note that `main.py` reads the camera of the machine it runs on, which is why the hosted
site uses the browser build in `docs/` instead.

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

The browser build lives at the repository root and needs no Python and no server. Every
frame is processed on the visitor's device — no video is uploaded anywhere.

Run it locally with any static file server:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`. A camera requires a secure context, so it works on
`localhost` and over HTTPS, but not from a `file://` path.

### Deploying to GitHub Pages

Under **Settings → Pages**, the source is the `main` branch, `/ (root)` folder. All asset
paths are relative, so the site works from any sub-path.

### Web version structure

```
index.html                     # Web interface
css/style.css                  # Styles
js/
├── app.js                     # Render loop and UI wiring (replaces main.py)
├── poseDetector.js            # MediaPipe Tasks Vision + getUserMedia
├── angleCalculator.js         # Port of AngleCalculator.py
├── landmarks.js               # Pose landmark indices
└── strategies/                # Ports of the four exercise strategies
```

The strategy ports are line-for-line equivalent to the Python originals: across 200
randomized landmark sets, all four strategies produce byte-identical guidance text in
both implementations.

## How It Works

The application uses the Strategy design pattern to implement different exercise correction algorithms:

1. **PoseDetector**: Captures video from your webcam and processes each frame using MediaPipe
2. **Exercise Strategies**: Each exercise has its own strategy class that analyzes body landmarks and angles
3. **Form Correction**: The system calculates angles between key body points and provides real-time feedback
4. **Visual Feedback**: Correction guidance is displayed directly on the video feed

## Project Structure

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
