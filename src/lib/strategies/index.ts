import type { ExerciseId, ExerciseOption, ExerciseStrategyConstructor } from '../types';
import { SquatStrategy } from './squatStrategy';
import { LeftBicepCurlStrategy } from './leftBicepCurlStrategy';
import { RightBicepCurlStrategy } from './rightBicepCurlStrategy';
import { PushUpStrategy } from './pushUpStrategy';

/** Strategy registry — the ids match the original Flask exercise_strategies map. */
export const exerciseStrategies: Record<ExerciseId, ExerciseStrategyConstructor> = {
    1: SquatStrategy,
    2: LeftBicepCurlStrategy,
    3: RightBicepCurlStrategy,
    4: PushUpStrategy
};

export const exerciseOptions: readonly ExerciseOption[] = [
    { id: 1, label: 'Squat' },
    { id: 2, label: 'Left Bicep Curl' },
    { id: 3, label: 'Right Bicep Curl' },
    { id: 4, label: 'Push Up' }
];

export { SquatStrategy, LeftBicepCurlStrategy, RightBicepCurlStrategy, PushUpStrategy };
