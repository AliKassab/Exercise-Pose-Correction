interface GuidanceOverlayProps {
    guidance: string[];
    poseDetected: boolean;
}

const GOOD_FORM = 'Keep Going!';

/**
 * Live form guidance. Rendered as DOM rather than painted onto the canvas so it
 * is selectable, styleable and announced by screen readers.
 */
export function GuidanceOverlay({ guidance, poseDetected }: GuidanceOverlayProps) {
    const isGoodForm = guidance.length === 1 && guidance[0] === GOOD_FORM;

    return (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 sm:p-4">
            <div aria-live="polite" className="flex flex-col items-start gap-1.5">
                {!poseDetected && (
                    <span className="rounded-lg bg-slate-950/70 px-3 py-2 text-sm font-medium text-slate-200 backdrop-blur-sm">
                        Step back so your whole body is in frame
                    </span>
                )}

                {guidance.map(line => (
                    <span
                        key={line}
                        className={`rounded-lg px-3 py-2 text-sm font-semibold backdrop-blur-sm sm:text-base ${
                            isGoodForm ? 'bg-emerald-500/90 text-white' : 'bg-amber-500/90 text-amber-950'
                        }`}
                    >
                        {line}
                    </span>
                ))}
            </div>
        </div>
    );
}
