from flask import Flask, Response, send_from_directory
import cv2
from flask_cors import CORS
import mediapipe as mp
from PoseDetector import PoseDetector
from SquatStrategy import SquatStrategy
from LeftBicepCurlStrategy import LeftBicepCurlStrategy
from RightBicepCurlStrategy import RightBicepCurlStrategy
from PushUpStrategy import PushUpStrategy

app = Flask(__name__)
CORS(app)

pose_detector = PoseDetector()
mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

exercise_strategies = {
    1: SquatStrategy,
    2: LeftBicepCurlStrategy,
    3: RightBicepCurlStrategy,
    4: PushUpStrategy
}

def generate_frames(exercise_id):
    while pose_detector.cap.isOpened():
        processed_frame = pose_detector.process_frame()
        if processed_frame is None:
            break

        image, results = processed_frame
        landmarks = pose_detector.detect_landmarks(results)

        if landmarks and exercise_id in exercise_strategies:
            strategy_class = exercise_strategies[exercise_id]
            strategy = strategy_class(landmarks)
            guide = strategy.correct_form()

            guide_position = (25, 25)
            for line in guide.split('\n'):
                cv2.putText(image, line, guide_position, cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2, cv2.LINE_AA)
                guide_position = (guide_position[0], guide_position[1] + 50)

        mp_draw.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        ret, buffer = cv2.imencode('.jpg', image)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    pose_detector.release_camera()

@app.route('/')
def index():
    return send_from_directory('', 'index.html')

@app.route('/video_feed/<int:exercise_id>')
def video_feed(exercise_id):
    return Response(generate_frames(exercise_id), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run()
