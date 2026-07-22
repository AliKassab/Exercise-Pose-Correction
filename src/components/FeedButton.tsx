import type { FeedStatus } from '../hooks/usePoseCorrection';

interface FeedButtonProps {
    status: FeedStatus;
    onToggle: () => void;
}

export function FeedButton({ status, onToggle }: FeedButtonProps) {
    const isLive = status === 'running';
    const isBusy = status === 'loading';

    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={isBusy}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors disabled:cursor-progress disabled:opacity-70 ${
                isLive ? 'bg-slate-700 hover:bg-slate-600' : 'bg-brand-600 hover:bg-brand-500'
            }`}
        >
            {isBusy ? (
                <>
                    <span
                        className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                        aria-hidden="true"
                    />
                    Starting…
                </>
            ) : isLive ? (
                <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                        <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                    Stop camera
                </>
            ) : (
                <>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                        <path d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5" />
                    </svg>
                    Start camera
                </>
            )}
        </button>
    );
}
