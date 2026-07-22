import { AngleCalculator } from '../angleCalculator';
import { POSE } from '../landmarks';
import type { ExerciseAnalysisStrategy, Landmark, PoseLandmarks } from '../types';

export class RightBicepCurlStrategy implements ExerciseAnalysisStrategy {
    private readonly shoulderR: Landmark;
    private readonly wristR: Landmark;

    private readonly rElbowAngle: number;
    private readonly rShoulderWrist: number;

    constructor(landmarks: PoseLandmarks) {
        this.shoulderR = landmarks[POSE.RIGHT_SHOULDER];
        this.wristR = landmarks[POSE.RIGHT_WRIST];

        this.rElbowAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST);

        this.rShoulderWrist = AngleCalculator.calculateHorizontalDistance(this.shoulderR, this.wristR, 3);
    }

    correctForm(): string {
        let bicepGuide = '';

        // The shoulder-angle gate is intentionally absent, matching
        // LeftBicepCurlStrategy; with it the right arm was far harder to satisfy.
        if (
            this.rElbowAngle > 20 && this.rElbowAngle < 60 &&
            this.rShoulderWrist <= 0.1 && this.rShoulderWrist > -0.1
        ) {
            bicepGuide = 'Keep Going!';
        } else {
            if (this.rElbowAngle < 20) {
                bicepGuide += 'Lower your wrist\n';
            }
            if (this.rElbowAngle > 60) {
                bicepGuide += 'Raise your wrist\n';
            }
            if (this.rShoulderWrist > 0.1) {
                bicepGuide += 'Move your wrist to the Left\n';
            }
            if (this.rShoulderWrist < -0.1) {
                bicepGuide += 'Move your wrist to the Right\n';
            }
        }

        return bicepGuide;
    }
}
