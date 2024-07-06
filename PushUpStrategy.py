from ExerciseAnalysisStrategy import IExerciseAnalysisStrategy
from AngleCalculator import AngleCalculator
import mediapipe as mp

class PushUpStrategy(IExerciseAnalysisStrategy):
    mp_pose = mp.solutions.pose.PoseLandmark  

    def __init__(self, landmarks):

        self.l_elbow_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.LEFT_WRIST,
                                                                            self.mp_pose.LEFT_ELBOW,
                                                                            self.mp_pose.LEFT_SHOULDER)
        self.r_elbow_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.RIGHT_WRIST,
                                                                            self.mp_pose.RIGHT_ELBOW,
                                                                            self.mp_pose.RIGHT_SHOULDER)
        
        self.l_body_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.LEFT_SHOULDER,
                                                                            self.mp_pose.LEFT_HIP,
                                                                            self.mp_pose.LEFT_ANKLE)

        self.r_body_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.RIGHT_SHOULDER,
                                                                            self.mp_pose.RIGHT_HIP,
                                                                            self.mp_pose.RIGHT_ANKLE)

        self.elbow_angle = (self.l_elbow_angle + self.r_elbow_angle) / 2

        self.body_angle = (self.l_body_angle + self.r_body_angle) / 2

    def correct_form(self):
        pushup_guide = ""

        if 70 <= self.elbow_angle <= 100 and 160 <= self.body_angle <= 200:
            pushup_guide = 'Keep Going!'

        else:
            #Condition 1
            if self.elbow_angle < 60 :
                pushup_guide += 'Raise Your Chest\n'  
                 
            if self.elbow_angle > 100 :
                pushup_guide += 'Lower Your Chest\n'

            #Condition 2
            if self.body_angle < 160 :
                pushup_guide += 'Lower Your Hips\n'

            #Condition 3
            if self.body_angle > 200 :
                pushup_guide += 'Raise Your Hips\n'

        return pushup_guide