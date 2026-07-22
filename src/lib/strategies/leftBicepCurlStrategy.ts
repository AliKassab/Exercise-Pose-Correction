import { AngleCalculator } from '../angleCalculator';
import { POSE } from '../landmarks';
import type { ExerciseAnalysisStrategy, PoseLandmarks } from '../types';

export class LeftBicepCurlStrategy implements ExerciseAnalysisStrategy {
    private readonly lElbowAngle: number;
    /** Always >= 0: calculateHorizontalDistance returns an absolute value. */
    private readonly lShoulderWrist: number;

    constructor(landmarks: PoseLandmarks) {
        this.lElbowAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.LEFT_SHOULDER, POSE.LEFT_ELBOW, POSE.LEFT_WRIST);

        this.lShoulderWrist = AngleCalculator.calculateHorizontalDistance(
            landmarks[POSE.LEFT_SHOULDER], landmarks[POSE.LEFT_WRIST], 3);
    }

    correctForm(): string {
        let bicepGuide = '';

        if (this.lElbowAngle > 20 && this.lElbowAngle < 60 && this.lShoulderWrist <= 0.1) {
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
        }

        return bicepGuide;
    }
}
