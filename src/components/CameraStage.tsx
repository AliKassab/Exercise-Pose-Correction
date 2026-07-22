import type { RefObject } from 'react';

interface CameraStageProps {
    videoRef: RefObject<HTMLVideoElement | null>;
    canvasRef: RefObject<HTMLCanvasElement | null>;
    isLive: boolean;
}

export function CameraStage({ videoRef, canvasRef, isLive }: CameraStageProps) {
    return (
        <div className="relative aspect-[4/3] w-full max-w-2xl overflow-hidden rounded-xl border-4 border-sky-400 bg-slate-900 shadow-lg shadow-black/30">
            <video ref={videoRef} playsInline muted className="hidden" />
            <canvas ref={canvasRef} width={640} height={480} className="h-full w-full object-cover" />
            {!isLive && (
                <p className="absolute inset-0 flex items-center justify-center text-sm text-slate-500">
                    Camera off
                </p>
            )}
        </div>
    );
}
