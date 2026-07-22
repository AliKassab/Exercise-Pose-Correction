import { AngleCalculator } from '../angleCalculator';
import { POSE } from '../landmarks';
import type { ExerciseAnalysisStrategy, PoseLandmarks } from '../types';

export class PushUpStrategy implements ExerciseAnalysisStrategy {
    private readonly elbowAngle: number;
    private readonly bodyAngle: number;

    constructor(landmarks: PoseLandmarks) {
        const lElbowAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.LEFT_WRIST, POSE.LEFT_ELBOW, POSE.LEFT_SHOULDER);
        const rElbowAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.RIGHT_WRIST, POSE.RIGHT_ELBOW, POSE.RIGHT_SHOULDER);

        const lBodyAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.LEFT_SHOULDER, POSE.LEFT_HIP, POSE.LEFT_ANKLE);
        const rBodyAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP, POSE.RIGHT_ANKLE);

        this.elbowAngle = (lElbowAngle + rElbowAngle) / 2;
        this.bodyAngle = (lBodyAngle + rBodyAngle) / 2;
    }

    correctForm(): string {
        let pushupGuide = '';

        if (
            this.elbowAngle >= 70 && this.elbowAngle <= 100 &&
            this.bodyAngle >= 160 && this.bodyAngle <= 200
        ) {
            pushupGuide = 'Keep Going!';
        } else {
            if (this.elbowAngle < 60) {
                pushupGuide += 'Raise Your Chest\n';
            }
            if (this.elbowAngle > 100) {
                pushupGuide += 'Lower Your Chest\n';
            }
            if (this.bodyAngle < 160) {
                pushupGuide += 'Lower Your Hips\n';
            }
            if (this.bodyAngle > 200) {
                pushupGuide += 'Raise Your Hips\n';
            }
        }

        return pushupGuide;
    }
}
