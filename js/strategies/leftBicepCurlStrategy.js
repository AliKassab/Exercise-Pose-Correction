import { IExerciseAnalysisStrategy } from './exerciseAnalysisStrategy.js';
import { AngleCalculator } from '../angleCalculator.js';
import { POSE } from '../landmarks.js';

export class LeftBicepCurlStrategy extends IExerciseAnalysisStrategy {
    constructor(landmarks) {
        super(landmarks);

        this.hip_l = landmarks[POSE.LEFT_HIP];
        this.shoulder_l = landmarks[POSE.LEFT_SHOULDER];
        this.wrist_l = landmarks[POSE.LEFT_WRIST];
        this.elbow_l = landmarks[POSE.LEFT_ELBOW];

        this.l_elbow_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW, POSE.LEFT_WRIST);

        this.l_shoulder_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.LEFT_ELBOW, POSE.LEFT_SHOULDER, POSE.LEFT_HIP);

        this.l_shoulder_wrist = AngleCalculator.calculateHorizontalDistance(this.shoulder_l, this.wrist_l, 3);
    }

    correctForm() {
        let bicepGuide = '';

        if (20 < this.l_elbow_angle && this.l_elbow_angle < 60 &&
            0.1 >= this.l_shoulder_wrist && this.l_shoulder_wrist > -0.1) {
            bicepGuide = 'Keep Going!';
        } else {
            // Condition 1
            if (20 > this.l_elbow_angle) {
                bicepGuide += 'Lower your wrist\n';
            }
            if (60 < this.l_elbow_angle) {
                bicepGuide += 'Raise your wrist\n';
            }
            // Condition 2
            if (0.1 < this.l_shoulder_wrist) {
                bicepGuide += 'Move your wrist to the Right\n';
            }
            if (-0.1 > this.l_shoulder_wrist) {
                bicepGuide += 'Move your wrist to the Left\n';
            }
        }

        return bicepGuide;
    }
}
