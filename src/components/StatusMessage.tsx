import type { FeedStatus } from '../hooks/usePoseCorrection';

interface StatusMessageProps {
    status: FeedStatus;
    message: string;
}

export function StatusMessage({ status, message }: StatusMessageProps) {
    const isError = status === 'error';

    return (
        <p
            role="status"
            aria-live="polite"
            className={`flex items-start justify-center gap-2 text-center text-sm ${
                isError ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
            }`}
        >
            {isError && (
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4.5M12 16h.01" />
                </svg>
            )}
            {message}
        </p>
    );
}
