# Exercise Pose Correction

A real-time exercise form correction application that uses computer vision and pose detection to help users maintain proper form while exercising. The application provides instant feedback on exercise technique using your webcam.

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

## Usage

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
├── index.html                   # Web interface
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
