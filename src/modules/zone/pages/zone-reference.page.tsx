'use client';

import { useEffect } from 'react';
import { AppPage } from '@shared/components/app-page';
import { DataTable, type Column } from '@shared/components/data-table';
import { EmptyState, ErrorState, LoadingState } from '@shared/components/status-message';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import type { Zone } from '@shared/models/zone.model';
import * as ZoneActions from '../store/zone.action';
import {
    selectDunCount,
    selectFilteredZones,
    selectRetryAfterSeconds,
    selectZoneFilter,
    selectZones,
    selectZonesByDun,
    selectZonesError,
    selectZonesLoading,
} from '../store/zone.selector';

/**
 * Feature page component, kept out of `app/` so routing stays a Next.js
 * concern and the feature stays self-contained — the same split the Angular
 * console gets from routing modules pointing at `pages/*.page.ts`.
 */

const COLUMNS: readonly Column<Zone>[] = [
    { key: 'zoneCode', header: 'Zone code', cell: zone => zone.zoneCode, mono: true },
    { key: 'nameMs', header: 'Nama (BM)', cell: zone => zone.nameMs },
    { key: 'nameEn', header: 'Name (EN)', cell: zone => zone.nameEn ?? <span className="muted">—</span> },
    { key: 'dunCode', header: 'DUN', cell: zone => zone.dunCode, mono: true },
];

export function ZoneReferencePage() {
    const dispatch = useAppDispatch();

    const zones = useAppSelector(selectZones);
    const filtered = useAppSelector(selectFilteredZones);
    const byDun = useAppSelector(selectZonesByDun);
    const dunCount = useAppSelector(selectDunCount);
    const loading = useAppSelector(selectZonesLoading);
    const error = useAppSelector(selectZonesError);
    const retryAfterSeconds = useAppSelector(selectRetryAfterSeconds);
    const filter = useAppSelector(selectZoneFilter);

    // The dispatch-on-enter that an Angular page does in `ngOnInit`.
    useEffect(() => {
        if (zones.length === 0) dispatch(ZoneActions.loadZones());
    }, [dispatch, zones.length]);

    return (
        <AppPage
            eyebrow="Reference data"
            title="Zones"
            lead={
                <>
                    The council&apos;s internal geographic subdivisions — the finest tier of the
                    Parliament &gt; DUN &gt; Zone hierarchy. Every application records the zone its
                    business premise falls in, and the zone code is a segment of the application
                    number.
                </>
            }
            actions={
                <button type="button" className="btn" onClick={() => dispatch(ZoneActions.loadZones())} disabled={loading}>
                    {loading ? 'Loading…' : 'Reload'}
                </button>
            }
        >
            {error ? (
                <ErrorState
                    message={error}
                    retryAfterSeconds={retryAfterSeconds}
                    onRetry={() => dispatch(ZoneActions.loadZones())}
                />
            ) : loading && zones.length === 0 ? (
                <LoadingState label="Loading zones from the sandbox…" />
            ) : (
                <>
                    <div className="toolbar">
                        <label className="field">
                            <span className="sr-only">Filter zones</span>
                            <input
                                type="search"
                                placeholder="Filter by code, name or DUN…"
                                value={filter}
                                onChange={event => dispatch(ZoneActions.setZoneFilter({ filter: event.target.value }))}
                            />
                        </label>
                        <p className="count">
                            <strong>{filtered.length.toLocaleString()}</strong>
                            {filtered.length === zones.length ? ' zones' : ` of ${zones.length.toLocaleString()} zones`}
                            <span className="muted"> · {dunCount} DUN</span>
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState label="No zone matches that filter." />
                    ) : (
                        <>
                            <DataTable columns={COLUMNS} rows={filtered} rowKey={zone => zone.zoneCode} caption="Zones" />

                            <section className="panel">
                                <h2 className="panel-title">Grouped by DUN</h2>
                                <ul className="group-list">
                                    {byDun.map(group => (
                                        <li key={group.dunCode}>
                                            <p className="group-key mono">{group.dunCode}</p>
                                            <p className="group-members">
                                                {group.zones.map(zone => zone.nameMs).join(', ')}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </>
                    )}
                </>
            )}
        </AppPage>
    );
}
