import { IExerciseAnalysisStrategy } from './exerciseAnalysisStrategy.js';
import { AngleCalculator } from '../angleCalculator.js';
import { POSE } from '../landmarks.js';

export class PushUpStrategy extends IExerciseAnalysisStrategy {
    constructor(landmarks) {
        super(landmarks);

        this.l_elbow_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.LEFT_WRIST, POSE.LEFT_ELBOW, POSE.LEFT_SHOULDER);
        this.r_elbow_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.RIGHT_WRIST, POSE.RIGHT_ELBOW, POSE.RIGHT_SHOULDER);

        this.l_body_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.LEFT_SHOULDER, POSE.LEFT_HIP, POSE.LEFT_ANKLE);
        this.r_body_angle = AngleCalculator.calculateLandmarksAngle(landmarks,
            POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP, POSE.RIGHT_ANKLE);

        this.elbow_angle = (this.l_elbow_angle + this.r_elbow_angle) / 2;
        this.body_angle = (this.l_body_angle + this.r_body_angle) / 2;
    }

    correctForm() {
        let pushupGuide = '';

        if (70 <= this.elbow_angle && this.elbow_angle <= 100 &&
            160 <= this.body_angle && this.body_angle <= 200) {
            pushupGuide = 'Keep Going!';
        } else {
            // Condition 1
            if (this.elbow_angle < 60) {
                pushupGuide += 'Raise Your Chest\n';
            }
            if (this.elbow_angle > 100) {
                pushupGuide += 'Lower Your Chest\n';
            }

            // Condition 2
            if (this.body_angle < 160) {
                pushupGuide += 'Lower Your Hips\n';
            }

            // Condition 3
            if (this.body_angle > 200) {
                pushupGuide += 'Raise Your Hips\n';
            }
        }

        return pushupGuide;
    }
}
