import numpy as np
import mediapipe as mp

class AngleCalculator:
    
    def calculate_angle(a, b, c):
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        if angle > 180.0:
            angle = 360 - angle
        return angle
    
    def calculate_angle_from_landmarks(landmarks, point1, point2, point3):
            p1 = [landmarks[point1.value].x, landmarks[point1.value].y]
            p2 = [landmarks[point2.value].x, landmarks[point2.value].y]
            p3 = [landmarks[point3.value].x, landmarks[point3.value].y]
            angle = AngleCalculator.calculate_angle(p1, p2, p3)
            return angle
    
    def calculate_vertical_distance(point1, point2, factor):
         return round(abs(point1.y - point2.y), factor)
         
    def calculate_horizontal_distance(point1, point2, factor):
         return round(abs(point1.x - point2.x), factor)        