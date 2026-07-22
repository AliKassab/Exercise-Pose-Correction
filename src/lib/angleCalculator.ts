import type { Landmark, PoseLandmarks } from './types';
import type { PoseLandmarkIndex } from './landmarks';

/** Port of AngleCalculator.py — geometry over normalized landmark coordinates. */
export const AngleCalculator = {
    /** Interior angle at `b`, in degrees, folded into [0, 180]. */
    calculateMiddleAngle(a: readonly [number, number], b: readonly [number, number], c: readonly [number, number]): number {
        const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
        let angle = Math.abs((radians * 180.0) / Math.PI);
        if (angle > 180.0) {
            angle = 360 - angle;
        }
        return angle;
    },

    calculateLandmarksAngle(
        landmarks: PoseLandmarks,
        point1: PoseLandmarkIndex,
        point2: PoseLandmarkIndex,
        point3: PoseLandmarkIndex
    ): number {
        const p1 = [landmarks[point1].x, landmarks[point1].y] as const;
        const p2 = [landmarks[point2].x, landmarks[point2].y] as const;
        const p3 = [landmarks[point3].x, landmarks[point3].y] as const;
        return AngleCalculator.calculateMiddleAngle(p1, p2, p3);
    },

    calculateVerticalDistance(point1: Landmark, point2: Landmark, factor: number): number {
        return AngleCalculator.round(Math.abs(point1.y - point2.y), factor);
    },

    calculateHorizontalDistance(point1: Landmark, point2: Landmark, factor: number): number {
        return AngleCalculator.round(Math.abs(point1.x - point2.x), factor);
    },

    round(value: number, factor: number): number {
        const scale = 10 ** factor;
        return Math.round(value * scale) / scale;
    }
};
