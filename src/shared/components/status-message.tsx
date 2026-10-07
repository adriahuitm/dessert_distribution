'use client';

import { SANDBOX_RATE_LIMITED_LABEL } from '@shared/models/sandbox.model';

/**
 * The three states every sandbox-backed list lands in: loading, failed, empty.
 * Kept in one component so a screen never invents its own phrasing for them —
 * and so the rate-limit case is explained rather than shown as a raw error.
 */

export function LoadingState({ label }: { label: string }) {
    return (
        <div className="state" role="status" aria-live="polite">
            <span className="spinner" aria-hidden="true" />
            <p>{label}</p>
        </div>
    );
}

export function EmptyState({ label }: { label: string }) {
    return (
        <div className="state">
            <p>{label}</p>
        </div>
    );
}

export function ErrorState({
    message,
    retryAfterSeconds,
    onRetry,
}: {
    message: string;
    retryAfterSeconds?: number | null;
    onRetry?: () => void;
}) {
    const rateLimited = typeof retryAfterSeconds === 'number';

    return (
        <div className="state state-error" role="alert">
            <p className="state-title">{rateLimited ? SANDBOX_RATE_LIMITED_LABEL : 'Could not load'}</p>
            <p>{message}</p>
            {rateLimited ? (
                <p className="state-hint">
                    The per-credential budget refills every minute. Try again in about{' '}
                    <strong>{retryAfterSeconds}s</strong>.
                </p>
            ) : null}
            {onRetry ? (
                <button type="button" className="btn" onClick={onRetry}>
                    Retry
                </button>
            ) : null}
        </div>
    );
}
