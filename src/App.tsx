import { useState } from 'react';
import { CameraStage } from './components/CameraStage';
import { ExerciseControls } from './components/ExerciseControls';
import { StatusMessage } from './components/StatusMessage';
import { usePoseCorrection } from './hooks/usePoseCorrection';
import type { ExerciseId } from './lib/types';

export default function App() {
    const [exerciseId, setExerciseId] = useState<ExerciseId>(1);
    const { videoRef, canvasRef, status, message, start, stop } = usePoseCorrection(exerciseId);

    const isLive = status === 'running';

    return (
        <main className="flex min-h-screen items-center justify-center bg-slate-800 p-6 text-white">
            <div className="flex w-full max-w-3xl flex-col items-center text-center">
                <h1 className="mb-2 text-3xl font-bold">Real-Time Pose Detection</h1>
                <p className="mb-5 text-sm text-slate-400">
                    Form correction for squats, bicep curls and push-ups — running entirely in your browser.
                </p>

                <CameraStage videoRef={videoRef} canvasRef={canvasRef} isLive={isLive} />

                <ExerciseControls
                    exerciseId={exerciseId}
                    onExerciseChange={setExerciseId}
                    isLive={isLive}
                    isBusy={status === 'loading'}
                    onToggle={isLive ? stop : start}
                />

                <StatusMessage status={status} message={message} />

                <footer className="mt-6 text-xs">
                    <a
                        href="https://github.com/AliKassab/Exercise-Pose-Correction"
                        className="text-sky-400 hover:underline"
                    >
                        Source on GitHub
                    </a>
                </footer>
            </div>
        </main>
    );
}
