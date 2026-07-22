// Port of AngleCalculator.py — normalized landmark geometry helpers.

export class AngleCalculator {
    static calculateMiddleAngle(a, b, c) {
        const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
        let angle = Math.abs(radians * 180.0 / Math.PI);
        if (angle > 180.0) {
            angle = 360 - angle;
        }
        return angle;
    }

    static calculateLandmarksAngle(landmarks, point1, point2, point3) {
        const p1 = [landmarks[point1].x, landmarks[point1].y];
        const p2 = [landmarks[point2].x, landmarks[point2].y];
        const p3 = [landmarks[point3].x, landmarks[point3].y];
        return AngleCalculator.calculateMiddleAngle(p1, p2, p3);
    }

    static calculateVerticalDistance(point1, point2, factor) {
        return AngleCalculator.round(Math.abs(point1.y - point2.y), factor);
    }

    static calculateHorizontalDistance(point1, point2, factor) {
        return AngleCalculator.round(Math.abs(point1.x - point2.x), factor);
    }

    static round(value, factor) {
        const scale = Math.pow(10, factor);
        return Math.round(value * scale) / scale;
    }
}
