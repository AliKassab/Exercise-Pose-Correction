import cv2
import mediapipe as mp

class PoseDetector:
    def __init__(self):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)
        self.cap = cv2.VideoCapture(0)

    def process_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None
        
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image.flags.writeable = False
        
        results = self.pose.process(image)
        
        image.flags.writeable = True
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
        
        return image, results

    def detect_landmarks(self, results):
        if results.pose_landmarks:
            return results.pose_landmarks.landmark
        else:
            return None

    def release_camera(self):
        self.cap.release()