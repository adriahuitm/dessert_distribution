'use client';

import { useEffect } from 'react';
import { AppPage } from '@shared/components/app-page';
import { DataTable, type Column } from '@shared/components/data-table';
import { StatCard } from '@shared/components/stat-card';
import { EmptyState, ErrorState, LoadingState } from '@shared/components/status-message';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { TIER_LABEL, type BusinessActivity } from '@shared/models/business-activity.model';
import * as BusinessActivityActions from '../store/business-activity.action';
import {
    selectActivities,
    selectActivitiesError,
    selectActivitiesLoading,
    selectBusinessActivityFilter,
    selectFilteredActivities,
    selectRetryAfterSeconds,
    selectSelectableCount,
    selectSelectableOnly,
    selectTierCounts,
    selectTierFilter,
} from '../store/business-activity.selector';

const COLUMNS: readonly Column<BusinessActivity>[] = [
    { key: 'code', header: 'Code', cell: activity => activity.code, mono: true },
    { key: 'name', header: 'Nama (BM)', cell: activity => activity.name },
    { key: 'nameEn', header: 'Name (EN)', cell: activity => activity.nameEn ?? <span className="muted">—</span> },
    {
        key: 'tier',
        header: 'Tier',
        cell: activity => (
            <span className={`chip chip-tier-${activity.tier}`}>
                {activity.tier} · {TIER_LABEL[activity.tier] ?? 'Unknown'}
            </span>
        ),
    },
    {
        key: 'selectable',
        header: 'Declarable',
        cell: activity =>
            activity.selectable ? <span className="chip chip-yes">Yes</span> : <span className="muted">Header only</span>,
    },
];

const TIERS: readonly (number | null)[] = [null, 1, 2, 3];

export function BusinessActivityReferencePage() {
    const dispatch = useAppDispatch();

    const activities = useAppSelector(selectActivities);
    const filtered = useAppSelector(selectFilteredActivities);
    const tierCounts = useAppSelector(selectTierCounts);
    const selectableCount = useAppSelector(selectSelectableCount);
    const loading = useAppSelector(selectActivitiesLoading);
    const error = useAppSelector(selectActivitiesError);
    const retryAfterSeconds = useAppSelector(selectRetryAfterSeconds);
    const tier = useAppSelector(selectTierFilter);
    const selectableOnly = useAppSelector(selectSelectableOnly);
    const filter = useAppSelector(selectBusinessActivityFilter);

    useEffect(() => {
        if (activities.length === 0) dispatch(BusinessActivityActions.loadBusinessActivities());
    }, [dispatch, activities.length]);

    return (
        <AppPage
            eyebrow="Reference data"
            title="Business activities"
            lead={
                <>
                    The council&apos;s three-tier classification of what a business does, based on
                    the national MDKT taxonomy. Tier 1 and 2 are grouping headers for guided
                    pickers; only tier-3 leaves are <strong>declarable</strong> on an application —
                    a picker that offers a header produces an application the council cannot
                    process.
                </>
            }
            actions={
                <button
                    type="button"
                    className="btn"
                    onClick={() => dispatch(BusinessActivityActions.loadBusinessActivities())}
                    disabled={loading}
                >
                    {loading ? 'Loading…' : 'Reload'}
                </button>
            }
        >
            {error ? (
                <ErrorState
                    message={error}
                    retryAfterSeconds={retryAfterSeconds}
                    onRetry={() => dispatch(BusinessActivityActions.loadBusinessActivities())}
                />
            ) : loading && activities.length === 0 ? (
                <LoadingState label="Loading the taxonomy…" />
            ) : (
                <>
                    <div className="stat-row">
                        <StatCard label="Total nodes" value={activities.length.toLocaleString()} />
                        <StatCard label="Declarable" value={selectableCount.toLocaleString()} note="Tier-3 leaves" />
                        <StatCard
                            label="Headers"
                            value={(activities.length - selectableCount).toLocaleString()}
                            note="Tier 1 and 2"
                        />
                    </div>

                    <div className="toolbar">
                        <div className="segmented" role="group" aria-label="Filter by tier">
                            {TIERS.map(value => (
                                <button
                                    key={value ?? 'ALL'}
                                    type="button"
                                    className={tier === value ? 'is-active' : undefined}
                                    aria-pressed={tier === value}
                                    onClick={() => dispatch(BusinessActivityActions.setTierFilter({ tier: value }))}
                                >
                                    {value === null ? 'All tiers' : `Tier ${value}`}
                                    {value !== null && tierCounts[value] ? (
                                        <span className="segmented-count"> {tierCounts[value]}</span>
                                    ) : null}
                                </button>
                            ))}
                        </div>

                        <label className="checkbox">
                            <input
                                type="checkbox"
                                checked={selectableOnly}
                                onChange={event =>
                                    dispatch(
                                        BusinessActivityActions.setSelectableOnly({
                                            selectableOnly: event.target.checked,
                                        }),
                                    )
                                }
                            />
                            <span>Declarable only</span>
                        </label>

                        <label className="field">
                            <span className="sr-only">Filter activities</span>
                            <input
                                type="search"
                                placeholder="Filter by code or name…"
                                value={filter}
                                onChange={event =>
                                    dispatch(
                                        BusinessActivityActions.setBusinessActivityFilter({
                                            filter: event.target.value,
                                        }),
                                    )
                                }
                            />
                        </label>

                        <p className="count">
                            <strong>{filtered.length.toLocaleString()}</strong>
                            {filtered.length === activities.length
                                ? ' nodes'
                                : ` of ${activities.length.toLocaleString()} nodes`}
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState label="No activity matches those filters." />
                    ) : (
                        <DataTable
                            columns={COLUMNS}
                            rows={filtered}
                            rowKey={activity => activity.code}
                            caption="Business activity taxonomy"
                        />
                    )}
                </>
            )}
        </AppPage>
    );
}
