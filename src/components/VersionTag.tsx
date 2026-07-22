const REPO_URL = 'https://github.com/AliKassab/Exercise-Pose-Correction';

/**
 * Build stamp. The values are injected by vite.config.ts, so the page always
 * reports the commit it was actually built from.
 */
export function VersionTag() {
    const isTraceable = __APP_COMMIT__ !== 'local';

    return (
        <p className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
            <span>v{__APP_VERSION__}</span>
            <span aria-hidden="true"> · </span>
            {isTraceable ? (
                <a
                    href={`${REPO_URL}/commit/${__APP_COMMIT__}`}
                    className="hover:text-brand-500 hover:underline"
                    title={`Built ${__APP_BUILT_AT__}`}
                >
                    {__APP_COMMIT__}
                </a>
            ) : (
                <span title={`Built ${__APP_BUILT_AT__}`}>{__APP_COMMIT__}</span>
            )}
        </p>
    );
}
