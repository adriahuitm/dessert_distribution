import type { ReactNode } from 'react';

/** A single headline figure with its label and an optional note beneath. */
export function StatCard({ label, value, note }: { label: string; value: ReactNode; note?: string }) {
    return (
        <div className="stat">
            <p className="stat-label">{label}</p>
            <p className="stat-value">{value}</p>
            {note ? <p className="stat-note">{note}</p> : null}
        </div>
    );
}

/**
 * A labelled count breakdown — a status or stage map rendered as rows with
 * proportional bars. The sandbox's statistics endpoint returns exactly this
 * shape (every key present, 0 when empty), so zero rows are shown rather than
 * hidden: an absent stage and an empty stage mean different things to a council.
 */
export function CountBreakdown({
    title,
    counts,
    describe,
}: {
    title: string;
    counts: Record<string, number>;
    describe?: (key: string) => string | undefined;
}) {
    const entries = Object.entries(counts);
    const max = Math.max(1, ...entries.map(([, count]) => count));

    return (
        <section className="panel">
            <h2 className="panel-title">{title}</h2>
            <ul className="breakdown">
                {entries.map(([key, count]) => (
                    <li key={key} className={count === 0 ? 'is-zero' : undefined}>
                        <div className="breakdown-head">
                            <span className="breakdown-key" title={describe?.(key)}>
                                {key}
                            </span>
                            <span className="breakdown-count mono">{count.toLocaleString()}</span>
                        </div>
                        <div className="bar" aria-hidden="true">
                            <span style={{ width: `${(count / max) * 100}%` }} />
                        </div>
                        {describe?.(key) ? <p className="breakdown-desc">{describe(key)}</p> : null}
                    </li>
                ))}
            </ul>
        </section>
    );
}
