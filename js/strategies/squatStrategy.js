import { IExerciseAnalysisStrategy } from './exerciseAnalysisStrategy.js';
import { AngleCalculator } from '../angleCalculator.js';
import { POSE } from '../landmarks.js';

export class SquatStrategy extends IExerciseAnalysisStrategy {
    constructor(landmarks) {
        super(landmarks);

        this.hip_l = landmarks[POSE.LEFT_HIP];
        this.hip_r = landmarks[POSE.RIGHT_HIP];

        this.shoulder_l = landmarks[POSE.LEFT_SHOULDER];
        this.shoulder_r = landmarks[POSE.RIGHT_SHOULDER];

        this.knee_l = landmarks[POSE.LEFT_KNEE];
        this.knee_r = landmarks[POSE.RIGHT_KNEE];

        this.foot_l = landmarks[POSE.LEFT_FOOT_INDEX];
        this.foot_r = landmarks[POSE.RIGHT_FOOT_INDEX];

        this.r_knee_hip = AngleCalculator.calculateVerticalDistance(this.knee_r, this.hip_r, 3);
        this.l_knee_hip = AngleCalculator.calculateVerticalDistance(this.knee_l, this.hip_l, 3);

        this.r_knee_foot = AngleCalculator.calculateHorizontalDistance(this.knee_r, this.foot_r, 3);
        this.l_knee_foot = AngleCalculator.calculateHorizontalDistance(this.knee_l, this.foot_l, 3);

        this.l_hip_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.LEFT_SHOULDER, POSE.LEFT_HIP, POSE.LEFT_KNEE);
        this.r_hip_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP, POSE.RIGHT_KNEE);
        this.hip_angle = (this.l_hip_angle + this.r_hip_angle) / 2;
    }

    correctForm() {
        let squatGuide = '';

        if (60 < this.hip_angle && this.hip_angle < 120 &&
            this.l_knee_hip <= 0.2 && this.r_knee_hip <= 0.2 &&
            this.l_knee_foot <= 0.1 && this.r_knee_foot <= 0.1) {
            squatGuide = 'Keep Going!';
        } else {
            // Condition 1
            if (this.hip_angle < 60) {
                squatGuide += 'Raise Your Hips\n';
            }
            if (this.hip_angle > 120) {
                squatGuide += 'Lower Your Hips\n';
            }

            // Condition 2
            if (this.l_knee_hip > 0.2 || this.r_knee_hip > 0.2) {
                squatGuide += 'Make Sure Your Thighs Are Parallel To The Floor\n';
            }

            // Condition 3
            if (this.l_knee_foot > 0.1 || this.r_knee_foot > 0.1) {
                squatGuide += "Make Sure Your Knees Don't Exceed Your Toes\n";
            }
        }

        return squatGuide;
    }
}
