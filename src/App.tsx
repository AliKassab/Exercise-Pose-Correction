import { useState } from 'react';
import { CameraStage } from './components/CameraStage';
import { ExerciseSelector } from './components/ExerciseSelector';
import { FeedButton } from './components/FeedButton';
import { StatusMessage } from './components/StatusMessage';
import { VersionTag } from './components/VersionTag';
import { usePoseCorrection } from './hooks/usePoseCorrection';
import type { ExerciseId } from './lib/types';

export default function App() {
    const [exerciseId, setExerciseId] = useState<ExerciseId>(1);
    const { videoRef, canvasRef, status, message, guidance, poseDetected, start, stop } =
        usePoseCorrection(exerciseId);

    return (
        <div className="flex min-h-dvh flex-col">
            <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-10 sm:px-6 sm:py-14">
                <header className="mb-8 flex flex-col items-center text-center">
                    <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Runs entirely on your device
                    </span>

                    <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                        Real-Time Pose Detection
                    </h1>

                    <p className="mt-3 max-w-md text-sm text-pretty text-slate-600 sm:text-base dark:text-slate-400">
                        Form correction for squats, bicep curls and push-ups, powered by on-device pose
                        detection. No video ever leaves your browser.
                    </p>
                </header>

                <div className="w-full max-w-2xl">
                    <CameraStage
                        videoRef={videoRef}
                        canvasRef={canvasRef}
                        status={status}
                        guidance={guidance}
                        poseDetected={poseDetected}
                    />

                    <div className="mt-5 flex flex-col items-center gap-4">
                        <ExerciseSelector exerciseId={exerciseId} onChange={setExerciseId} />
                        <FeedButton status={status} onToggle={status === 'running' ? stop : start} />
                        <StatusMessage status={status} message={message} />
                    </div>
                </div>
            </main>

            <footer className="flex flex-col items-center gap-1.5 border-t border-slate-200 py-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <a
                    href="https://github.com/AliKassab/Exercise-Pose-Correction"
                    className="font-medium hover:text-brand-500"
                >
                    Source on GitHub
                </a>
                <VersionTag />
            </footer>
        </div>
    );
}
