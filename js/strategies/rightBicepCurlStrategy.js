import { IExerciseAnalysisStrategy } from './exerciseAnalysisStrategy.js';
import { AngleCalculator } from '../angleCalculator.js';
import { POSE } from '../landmarks.js';

export class RightBicepCurlStrategy extends IExerciseAnalysisStrategy {
    constructor(landmarks) {
        super(landmarks);

        this.hip_r = landmarks[POSE.RIGHT_HIP];
        this.shoulder_r = landmarks[POSE.RIGHT_SHOULDER];
        this.wrist_r = landmarks[POSE.RIGHT_WRIST];
        this.elbow_r = landmarks[POSE.RIGHT_ELBOW];

        this.r_elbow_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST);

        this.r_shoulder_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.RIGHT_ELBOW, POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP);

        this.r_shoulder_wrist = AngleCalculator.calculateHorizontalDistance(this.shoulder_r, this.wrist_r, 3);
    }

    correctForm() {
        let bicepGuide = '';

        // The shoulder-angle gate is disabled here to match LeftBicepCurlStrategy;
        // with it enabled the right arm was far harder to satisfy than the left.
        if (20 < this.r_elbow_angle && this.r_elbow_angle < 60 &&
            0.1 >= this.r_shoulder_wrist && this.r_shoulder_wrist > -0.1) {
            bicepGuide = 'Keep Going!';
        } else {
            // Condition 1
            if (20 > this.r_elbow_angle) {
                bicepGuide += 'Lower your wrist\n';
            }
            if (60 < this.r_elbow_angle) {
                bicepGuide += 'Raise your wrist\n';
            }
            // Condition 2
            if (0.1 < this.r_shoulder_wrist) {
                bicepGuide += 'Move your wrist to the Left\n';
            }
            if (-0.1 > this.r_shoulder_wrist) {
                bicepGuide += 'Move your wrist to the Right\n';
            }
        }

        return bicepGuide;
    }
}
