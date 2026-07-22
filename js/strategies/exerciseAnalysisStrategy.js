// Port of ExerciseAnalysisStrategy.py — the Strategy interface.

export class IExerciseAnalysisStrategy {
    constructor(landmarks) {
        if (new.target === IExerciseAnalysisStrategy) {
            throw new TypeError('IExerciseAnalysisStrategy is abstract');
        }
    }

    // Returns a string stating the angle adjustments.
    correctForm() {
        throw new Error('correctForm() must be implemented by the subclass');
    }
}
