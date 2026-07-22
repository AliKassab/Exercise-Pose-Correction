import { AngleCalculator } from '../angleCalculator';
import { POSE } from '../landmarks';
import type { ExerciseAnalysisStrategy, Landmark, PoseLandmarks } from '../types';

export class LeftBicepCurlStrategy implements ExerciseAnalysisStrategy {
    private readonly shoulderL: Landmark;
    private readonly wristL: Landmark;

    private readonly lElbowAngle: number;
    private readonly lShoulderWrist: number;

    constructor(landmarks: PoseLandmarks) {
        this.shoulderL = landmarks[POSE.LEFT_SHOULDER];
        this.wristL = landmarks[POSE.LEFT_WRIST];

        this.lElbowAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW, POSE.LEFT_WRIST);

        this.lShoulderWrist = AngleCalculator.calculateHorizontalDistance(this.shoulderL, this.wristL, 3);
    }

    correctForm(): string {
        let bicepGuide = '';

        if (
            this.lElbowAngle > 20 && this.lElbowAngle < 60 &&
            this.lShoulderWrist <= 0.1 && this.lShoulderWrist > -0.1
        ) {
            bicepGuide = 'Keep Going!';
        } else {
            if (this.lElbowAngle < 20) {
                bicepGuide += 'Lower your wrist\n';
            }
            if (this.lElbowAngle > 60) {
                bicepGuide += 'Raise your wrist\n';
            }
            if (this.lShoulderWrist > 0.1) {
                bicepGuide += 'Move your wrist to the Right\n';
            }
            if (this.lShoulderWrist < -0.1) {
                bicepGuide += 'Move your wrist to the Left\n';
            }
        }

        return bicepGuide;
    }
}
