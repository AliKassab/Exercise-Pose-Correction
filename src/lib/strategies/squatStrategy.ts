import { AngleCalculator } from '../angleCalculator';
import { POSE } from '../landmarks';
import type { ExerciseAnalysisStrategy, Landmark, PoseLandmarks } from '../types';

export class SquatStrategy implements ExerciseAnalysisStrategy {
    private readonly hipL: Landmark;
    private readonly hipR: Landmark;
    private readonly kneeL: Landmark;
    private readonly kneeR: Landmark;
    private readonly footL: Landmark;
    private readonly footR: Landmark;

    private readonly rKneeHip: number;
    private readonly lKneeHip: number;
    private readonly rKneeFoot: number;
    private readonly lKneeFoot: number;
    private readonly hipAngle: number;

    constructor(landmarks: PoseLandmarks) {
        this.hipL = landmarks[POSE.LEFT_HIP];
        this.hipR = landmarks[POSE.RIGHT_HIP];
        this.kneeL = landmarks[POSE.LEFT_KNEE];
        this.kneeR = landmarks[POSE.RIGHT_KNEE];
        this.footL = landmarks[POSE.LEFT_FOOT_INDEX];
        this.footR = landmarks[POSE.RIGHT_FOOT_INDEX];

        this.rKneeHip = AngleCalculator.calculateVerticalDistance(this.kneeR, this.hipR, 3);
        this.lKneeHip = AngleCalculator.calculateVerticalDistance(this.kneeL, this.hipL, 3);

        this.rKneeFoot = AngleCalculator.calculateHorizontalDistance(this.kneeR, this.footR, 3);
        this.lKneeFoot = AngleCalculator.calculateHorizontalDistance(this.kneeL, this.footL, 3);

        const lHipAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.LEFT_SHOULDER, POSE.LEFT_HIP, POSE.LEFT_KNEE);
        const rHipAngle = AngleCalculator.calculateLandmarksAngle(
            landmarks, POSE.RIGHT_SHOULDER, POSE.RIGHT_HIP, POSE.RIGHT_KNEE);
        this.hipAngle = (lHipAngle + rHipAngle) / 2;
    }

    correctForm(): string {
        let squatGuide = '';

        if (
            this.hipAngle > 60 && this.hipAngle < 120 &&
            this.lKneeHip <= 0.2 && this.rKneeHip <= 0.2 &&
            this.lKneeFoot <= 0.1 && this.rKneeFoot <= 0.1
        ) {
            squatGuide = 'Keep Going!';
        } else {
            if (this.hipAngle < 60) {
                squatGuide += 'Raise Your Hips\n';
            }
            if (this.hipAngle > 120) {
                squatGuide += 'Lower Your Hips\n';
            }
            if (this.lKneeHip > 0.2 || this.rKneeHip > 0.2) {
                squatGuide += 'Make Sure Your Thighs Are Parallel To The Floor\n';
            }
            if (this.lKneeFoot > 0.1 || this.rKneeFoot > 0.1) {
                squatGuide += "Make Sure Your Knees Don't Exceed Your Toes\n";
            }
        }

        return squatGuide;
    }
}
