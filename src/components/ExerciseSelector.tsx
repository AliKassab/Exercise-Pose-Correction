import { useRef } from 'react';
import { exerciseOptions } from '../lib/strategies';
import type { ExerciseId } from '../lib/types';

interface ExerciseSelectorProps {
    exerciseId: ExerciseId;
    onChange: (id: ExerciseId) => void;
    disabled?: boolean;
}

/**
 * Segmented control. A radiogroup rather than a <select> so every option is
 * visible at a glance, with the roving tabindex and arrow-key navigation the
 * role implies: one tab stop for the group, arrows to move within it.
 */
export function ExerciseSelector({ exerciseId, onChange, disabled = false }: ExerciseSelectorProps) {
    const groupRef = useRef<HTMLDivElement | null>(null);

    const focusOption = (index: number) => {
        const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
        buttons?.[index]?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
        const count = exerciseOptions.length;
        let next: number;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                next = (index + 1) % count;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                next = (index - 1 + count) % count;
                break;
            case 'Home':
                next = 0;
                break;
            case 'End':
                next = count - 1;
                break;
            default:
                return;
        }

        event.preventDefault();
        onChange(exerciseOptions[next].id);
        focusOption(next);
    };

    return (
        <div
            ref={groupRef}
            role="radiogroup"
            aria-label="Exercise"
            className="flex flex-wrap justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/70 p-1.5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
            {exerciseOptions.map((option, index) => {
                const selected = option.id === exerciseId;
                return (
                    <button
                        key={option.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        tabIndex={selected ? 0 : -1}
                        disabled={disabled}
                        onClick={() => onChange(option.id)}
                        onKeyDown={event => handleKeyDown(event, index)}
                        className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                            selected
                                ? 'bg-brand-500 text-white shadow-sm'
                                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}
