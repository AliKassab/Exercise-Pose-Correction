import { AngleCalculator } from '../angleCalculator';
import { POSE } from '../landmarks';
import type { ExerciseAnalysisStrategy, PoseLandmarks } from '../types';

export class RightBicepCurlStrategy implements ExerciseAnalysisStrategy {
    private readonly rElbowAngle: number;
    /** Always >= 0: calculateHorizontalDistance returns an absolute value. */
    private readonly rShoulderWrist: number;

    constructor(landmarks: PoseLandmarks) {
        this.rElbowAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.RIGHT_SHOULDER, POSE.RIGHT_ELBOW, POSE.RIGHT_WRIST);

        this.rShoulderWrist = AngleCalculator.calculateHorizontalDistance(
            landmarks[POSE.RIGHT_SHOULDER], landmarks[POSE.RIGHT_WRIST], 3);
    }

    correctForm(): string {
        let bicepGuide = '';

        // No shoulder-angle gate here, matching LeftBicepCurlStrategy;
        // with it the right arm was far harder to satisfy than the left.
        if (this.rElbowAngle > 20 && this.rElbowAngle < 60 && this.rShoulderWrist <= 0.1) {
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
        }

        return bicepGuide;
    }
}
