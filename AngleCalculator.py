import numpy as np

# Assuming 'landmark' is a namedtuple or data class representing a point with 'x' and 'y' attributes

class AngleCalculator:
    
    @staticmethod
    def calculate_middle_angle(a, b, c):
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
        angle = np.abs(radians * 180.0 / np.pi)
        if angle > 180.0:
            angle = 360 - angle
        return angle
    
    @staticmethod
    def calculate_landmarks_angle(landmarks, point1, point2, point3):
        p1 = [landmarks[point1].x, landmarks[point1].y]
        p2 = [landmarks[point2].x, landmarks[point2].y]
        p3 = [landmarks[point3].x, landmarks[point3].y]
        angle = AngleCalculator.calculate_middle_angle(p1, p2, p3)
        return angle
    
    @staticmethod
    def calculate_vertical_distance(point1, point2, factor):
        return round(abs(point1.y - point2.y), factor)
         
    @staticmethod
    def calculate_horizontal_distance(point1, point2, factor):
        return round(abs(point1.x - point2.x), factor)
