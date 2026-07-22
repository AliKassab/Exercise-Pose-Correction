/** A single normalized pose landmark as returned by MediaPipe. */
export interface Landmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
}

/** The 33-landmark array for one detected pose. */
export type PoseLandmarks = readonly Landmark[];

/**
 * Analyses one exercise and reports how the form should be adjusted.
 * Implementations read landmarks once in the constructor, so a new instance
 * is created per analysed frame.
 */
export interface ExerciseAnalysisStrategy {
    /** Guidance text, newline-separated. Empty when nothing can be judged. */
    correctForm(): string;
}

export interface ExerciseStrategyConstructor {
    new (landmarks: PoseLandmarks): ExerciseAnalysisStrategy;
}

export type ExerciseId = 1 | 2 | 3 | 4;

export interface ExerciseOption {
    id: ExerciseId;
    label: string;
}
