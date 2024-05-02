from ExerciseAnalysisStrategy import IExerciseAnalysisStrategy
from AngleCalculator import AngleCalculator
import mediapipe as mp

class LeftBicepCurlStrategy(IExerciseAnalysisStrategy):

    mp_pose = mp.solutions.pose.PoseLandmark

    def __init__(self, landmarks):
        
        self.hip_l = landmarks[self.mp_pose.LEFT_HIP.value]

        self.shoulder_l = landmarks[self.mp_pose.LEFT_SHOULDER.value]

        self.wrist_l = landmarks[self.mp_pose.LEFT_WRIST.value]
        
        self.elbow_l = landmarks[self.mp_pose.LEFT_ELBOW.value]

        self.l_elbow_angle = AngleCalculator.calculate_angle_from_landmarks(landmarks,
                                                                            self.mp_pose.LEFT_SHOULDER,
                                                                            self.mp_pose.LEFT_ELBOW,
                                                                            self.mp_pose.LEFT_WRIST)
        
        self.l_shoulder_angle = AngleCalculator.calculate_angle_from_landmarks(landmarks,
                                                                            self.mp_pose.LEFT_ELBOW,
                                                                            self.mp_pose.LEFT_SHOULDER,
                                                                            self.mp_pose.LEFT_HIP)
        
        self.l_shoulder_wrist = AngleCalculator.calculate_horizontal_distance(self.shoulder_l, self.wrist_l, 3)

    def is_correct(self):
        bicep_guide = ""

        if 20 < self.l_elbow_angle < 60 and 10 < self.l_shoulder_angle < 20 and 0.1 >= self.l_shoulder_wrist > 0 :
            bicep_guide = 'Keep Going!'

        else:
            #Conditon 1
            if 20 > self.l_elbow_angle:
                bicep_guide += 'Lower your wrist\n'
            if 60 < self.l_elbow_angle:
                bicep_guide += 'Raise your wrist\n'    
            #Condition 2
            if 0.1 < self.l_shoulder_wrist:
                bicep_guide += 'Move your wrist to the Right\n'
            if 0.05 > self.l_shoulder_wrist:
                bicep_guide += 'Move your wrist to the Left\n'
            # #Condition 3
            if 10 > self.l_shoulder_angle:
                bicep_guide += 'Raise your elbow\n'
            if 20 < self.l_shoulder_angle:
                bicep_guide += 'Lower your elbow\n'    

        print(self.l_shoulder_wrist)
        return bicep_guide