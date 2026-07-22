import type { FeedStatus } from '../hooks/usePoseCorrection';

interface StatusMessageProps {
    status: FeedStatus;
    message: string;
}

export function StatusMessage({ status, message }: StatusMessageProps) {
    return (
        <p
            role="status"
            aria-live="polite"
            className={`mt-4 min-h-5 text-sm ${status === 'error' ? 'text-red-400' : 'text-slate-400'}`}
        >
            {message}
        </p>
    );
}
