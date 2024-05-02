import cv2
import mediapipe as mp
import numpy as np
import sys
import os

from PoseDetector import PoseDetector
from SquatStrategy import SquatStrategy
from LeftBicepCurlStrategy import LeftBicepCurlStrategy
from RightBicepCurlStrategy import RightBicepCurlStrategy
from PushUpStrategy import PushUpStrategy

def __init__(self):
    self.global_landmarks = None
    
def get_variable(self):
    return self.global_landmarks


def main():
    pose_detector = PoseDetector()
    mp_pose = mp.solutions.pose
    mp_draw = mp.solutions.drawing_utils
    exercise_id = os.environ.get('MY_EXERCISE')
    
    try:
        while pose_detector.cap.isOpened():
            processed_frame = pose_detector.process_frame()
            if processed_frame is None: 
                break
            
            image, results = processed_frame
            
            try:
                landmarks = pose_detector.detect_landmarks(results)
            
                if landmarks:  
                    if (exercise_id == '1'):         
                        SquatStrategy.__init__(SquatStrategy, landmarks)
                        guide = SquatStrategy.is_correct(SquatStrategy)
                    elif (exercise_id == '2'): 
                        LeftBicepCurlStrategy.__init__(LeftBicepCurlStrategy, landmarks)
                        guide = LeftBicepCurlStrategy.is_correct(LeftBicepCurlStrategy)
                    elif (exercise_id == '3'): 
                        RightBicepCurlStrategy.__init__(RightBicepCurlStrategy, landmarks)
                        guide = RightBicepCurlStrategy.is_correct(RightBicepCurlStrategy)
                    elif (exercise_id == '4'): 
                        PushUpStrategy.__init__(PushUpStrategy, landmarks)
                        guide = PushUpStrategy.is_correct(PushUpStrategy)    

                    lines = guide.split('\n')

                    position = (25,25)

                    for line in lines:
                        # Visualize Angle
                        cv2.putText(image, line,
                            position,
                            cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2, cv2.LINE_AA)
                        position = (position[0], position[1] + 50)
                        

                    exit_position = (25,450)
                    cv2.putText(image, 'Press Q to exit', exit_position,cv2.FONT_HERSHEY_SIMPLEX, 0.75, (0, 255, 0), 2, cv2.LINE_AA)

            except Exception as e:
                print("Error:", e)

            # Render detections
            mp_draw.draw_landmarks(image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            cv2.imshow("Mediapipe Feed:", image)

            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

    finally:
        pose_detector.release_camera()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    main()
