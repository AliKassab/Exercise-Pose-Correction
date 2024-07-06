from ExerciseAnalysisStrategy import IExerciseAnalysisStrategy
from AngleCalculator import AngleCalculator
import mediapipe as mp

class RightBicepCurlStrategy(IExerciseAnalysisStrategy):

    mp_pose = mp.solutions.pose.PoseLandmark

    def __init__(self, landmarks):
        
        self.hip_r = landmarks[self.mp_pose.RIGHT_HIP.value]

        self.shoulder_r = landmarks[self.mp_pose.RIGHT_SHOULDER.value]

        self.wrist_r = landmarks[self.mp_pose.RIGHT_WRIST.value]
        
        self.elbow_r = landmarks[self.mp_pose.RIGHT_ELBOW.value]

        self.r_elbow_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.RIGHT_SHOULDER,
                                                                            self.mp_pose.RIGHT_ELBOW,
                                                                            self.mp_pose.RIGHT_WRIST)
        
        self.r_shoulder_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.RIGHT_ELBOW,
                                                                            self.mp_pose.RIGHT_SHOULDER,
                                                                            self.mp_pose.RIGHT_HIP)
        
        self.r_shoulder_wrist = AngleCalculator.calculate_horizontal_distance(self.shoulder_r, self.wrist_r, 3)

    def correct_form(self):
        bicep_guide = ""

        if 20 < self.r_elbow_angle < 60 and 10 < self.r_shoulder_angle < 20 and 0.1 >= self.r_shoulder_wrist > -0.1 :
            bicep_guide = 'Keep Going!'

        else:
            #Conditon 1
            if 20 > self.r_elbow_angle:
                bicep_guide += 'Lower your wrist\n'
            if 60 < self.r_elbow_angle:
                bicep_guide += 'Raise your wrist\n'    
            #Condition 2
            if 0.1 < self.r_shoulder_wrist:
                bicep_guide += 'Move your wrist to the Left\n'
            if -0.1 > self.r_shoulder_wrist:
                bicep_guide += 'Move your wrist to the Right\n'
            # #Condition 3
            #if 10 > self.r_shoulder_angle:
             #   bicep_guide += 'Raise your elbow\n'
            #if 20 < self.r_shoulder_angle:
              #  bicep_guide += 'Lower your elbow\n'    

        print(self.r_shoulder_wrist)
        return bicep_guide