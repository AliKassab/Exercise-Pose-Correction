import { exerciseOptions } from '../lib/strategies';
import type { ExerciseId } from '../lib/types';

interface ExerciseControlsProps {
    exerciseId: ExerciseId;
    onExerciseChange: (id: ExerciseId) => void;
    isLive: boolean;
    isBusy: boolean;
    onToggle: () => void;
}

export function ExerciseControls({
    exerciseId,
    onExerciseChange,
    isLive,
    isBusy,
    onToggle
}: ExerciseControlsProps) {
    return (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <button
                type="button"
                onClick={onToggle}
                disabled={isBusy}
                className="rounded-md border-2 border-sky-400 bg-slate-900 px-4 py-2.5 text-base text-sky-400 transition-colors hover:bg-slate-800 disabled:cursor-progress disabled:opacity-60"
            >
                {isLive ? 'Stop Video Feed' : 'Start Video Feed'}
            </button>

            {isLive && (
                <select
                    value={exerciseId}
                    onChange={event => onExerciseChange(Number(event.target.value) as ExerciseId)}
                    aria-label="Exercise"
                    className="rounded-md border-2 border-sky-400 bg-slate-900 px-4 py-2.5 text-base text-sky-400"
                >
                    {exerciseOptions.map(option => (
                        <option key={option.id} value={option.id}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
}
