import type { RefObject } from 'react';
import type { FeedStatus } from '../hooks/usePoseCorrection';
import { GuidanceOverlay } from './GuidanceOverlay';

interface CameraStageProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    status: FeedStatus;
    guidance: string[];
    poseDetected: boolean;
}

export function CameraStage({ videoRef, canvasRef, status, guidance, poseDetected }: CameraStageProps) {
    const isLive = status === 'running';

    return (
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-slate-900 ring-1 ring-slate-200 dark:ring-slate-800">
            <video ref={videoRef} playsInline muted className="hidden" />
            <canvas ref={canvasRef} width={640} height={480} className="size-full object-cover" />

            {isLive && (
                <span className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold tracking-wide text-white uppercase backdrop-blur-sm">
                    <span className="size-1.5 animate-pulse rounded-full bg-red-500" />
                    Live
                </span>
            )}

            {status === 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-slate-300">
                    <span
                        className="size-8 animate-spin rounded-full border-2 border-slate-600 border-t-brand-400"
                        aria-hidden="true"
                    />
                    <p className="text-sm">Starting up…</p>
                </div>
            )}

            {status !== 'running' && status !== 'loading' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                    <CameraIcon />
                    <p className="text-sm text-slate-400">Your camera feed will appear here</p>
                </div>
            )}

            {isLive && <GuidanceOverlay guidance={guidance} poseDetected={poseDetected} />}
        </div>
    );
}

function CameraIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-9 text-slate-600"
            aria-hidden="true"
        >
            <path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.6a1 1 0 0 0 .8-.4l.9-1.2a1 1 0 0 1 .8-.4h4.8a1 1 0 0 1 .8.4l.9 1.2a1 1 0 0 0 .8.4h1.6A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
            <circle cx="12" cy="12.5" r="3.5" />
        </svg>
    );
}
