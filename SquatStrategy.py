from ExerciseAnalysisStrategy import IExerciseAnalysisStrategy
from AngleCalculator import AngleCalculator
import mediapipe as mp

class SquatStrategy(IExerciseAnalysisStrategy):

    mp_pose = mp.solutions.pose.PoseLandmark

    def __init__(self, landmarks):
        
        self.hip_l = landmarks[self.mp_pose.LEFT_HIP.value]
        self.hip_r = landmarks[self.mp_pose.RIGHT_HIP.value]

        self.shoulder_l = landmarks[self.mp_pose.LEFT_SHOULDER.value]
        self.shoulder_r = landmarks[self.mp_pose.RIGHT_SHOULDER.value]

        self.knee_l = landmarks[self.mp_pose.LEFT_KNEE.value]
        self.knee_r = landmarks[self.mp_pose.RIGHT_KNEE.value]

        self.foot_l = landmarks[self.mp_pose.LEFT_FOOT_INDEX.value]
        self.foot_r = landmarks[self.mp_pose.RIGHT_FOOT_INDEX.value]
        
        self.r_knee_hip = AngleCalculator.calculate_vertical_distance(self.knee_r, self.hip_r, 3)
        self.l_knee_hip = AngleCalculator.calculate_vertical_distance(self.knee_l, self.hip_l, 3)

        self.r_knee_foot = AngleCalculator.calculate_horizontal_distance(self.knee_r, self.foot_r, 3)
        self.l_knee_foot = AngleCalculator.calculate_horizontal_distance(self.knee_l, self.foot_l, 3)

        self.l_hip_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.LEFT_SHOULDER,
                                                                            self.mp_pose.LEFT_HIP,
                                                                            self.mp_pose.LEFT_KNEE)
        self.r_hip_angle = AngleCalculator.calculate_landmarks_angle(landmarks,
                                                                            self.mp_pose.RIGHT_SHOULDER,
                                                                            self.mp_pose.RIGHT_HIP,
                                                                            self.mp_pose.RIGHT_KNEE)
        self.hip_angle = (self.l_hip_angle + self.r_hip_angle) / 2

    def correct_form(self):
        squat_guide = ""

        if 60 < self.hip_angle < 120 and self.l_knee_hip <= 0.2 and self.r_knee_hip <= 0.2 and self.l_knee_foot <= 0.1 and self.r_knee_foot <= 0.1:
            squat_guide = 'Keep Going!'

        else:
            #Condition 1
            if self.hip_angle < 60 :
                squat_guide += 'Raise Your Hips\n'  
                 
            if self.hip_angle > 120 :
                squat_guide += 'Lower Your Hips\n'

            #Condition 2
            if self.l_knee_hip > 0.2 or self.r_knee_hip > 0.2 :
                squat_guide += 'Make Sure Your Thighs Are Parallel To The Floor\n'

            #Condition 3
            if self.l_knee_foot > 0.1 or self.r_knee_foot > 0.1 :
                squat_guide += 'Make Sure Your Knees Don\'t Exceed Your Toes\n'

        return squat_guide