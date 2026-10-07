'use client';

import { useEffect } from 'react';
import { AppPage } from '@shared/components/app-page';
import { DataTable, type Column } from '@shared/components/data-table';
import { StatCard } from '@shared/components/stat-card';
import { EmptyState, ErrorState, LoadingState } from '@shared/components/status-message';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { FAMILY_LABEL, RISK_LABEL, type LicenseFamily, type LicenseType } from '@shared/models/license-type.model';
import * as LicenseTypeActions from '../store/license-type.action';
import {
    selectFamilyCounts,
    selectFamilyFilter,
    selectFilteredLicenseTypes,
    selectHighRiskCount,
    selectLicenseTypeFilter,
    selectLicenseTypes,
    selectLicenseTypesError,
    selectLicenseTypesLoading,
    selectRetryAfterSeconds,
} from '../store/license-type.selector';

const COLUMNS: readonly Column<LicenseType>[] = [
    { key: 'code', header: 'Code', cell: type => type.code, mono: true },
    { key: 'name', header: 'Nama (BM)', cell: type => type.name },
    { key: 'nameEn', header: 'Name (EN)', cell: type => type.nameEn ?? <span className="muted">—</span> },
    {
        key: 'family',
        header: 'Family',
        cell: type => <span className={`chip chip-${type.family.toLowerCase()}`}>{FAMILY_LABEL[type.family]}</span>,
    },
    {
        key: 'risk',
        header: 'Risk',
        cell: type => {
            if (type.riskCategory === null) return <span className="muted">Unclassified</span>;
            return (
                <span className={type.riskCategory === 'HIGH_RISK' ? 'chip chip-risk' : 'muted'}>
                    {RISK_LABEL[type.riskCategory]}
                </span>
            );
        },
    },
];

const FAMILIES: readonly (LicenseFamily | null)[] = [null, 'LICENSE', 'PERMIT'];

export function LicenseTypeReferencePage() {
    const dispatch = useAppDispatch();

    const types = useAppSelector(selectLicenseTypes);
    const filtered = useAppSelector(selectFilteredLicenseTypes);
    const familyCounts = useAppSelector(selectFamilyCounts);
    const highRisk = useAppSelector(selectHighRiskCount);
    const loading = useAppSelector(selectLicenseTypesLoading);
    const error = useAppSelector(selectLicenseTypesError);
    const retryAfterSeconds = useAppSelector(selectRetryAfterSeconds);
    const family = useAppSelector(selectFamilyFilter);
    const filter = useAppSelector(selectLicenseTypeFilter);

    useEffect(() => {
        if (types.length === 0) dispatch(LicenseTypeActions.loadLicenseTypes());
    }, [dispatch, types.length]);

    return (
        <AppPage
            eyebrow="Reference data"
            title="License &amp; permit types"
            lead={
                <>
                    The catalog of what a business can apply for. A <strong>Lesen</strong> is an
                    annually renewable account that goes through the full pipeline including
                    committee tabling; a <strong>Permit</strong> is a one-off temporary grant on a
                    lighter one. Risk category decides which agency referrals are mandatory.
                </>
            }
            actions={
                <button
                    type="button"
                    className="btn"
                    onClick={() => dispatch(LicenseTypeActions.loadLicenseTypes())}
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
                    onRetry={() => dispatch(LicenseTypeActions.loadLicenseTypes())}
                />
            ) : loading && types.length === 0 ? (
                <LoadingState label="Loading the type catalog…" />
            ) : (
                <>
                    <div className="stat-row">
                        <StatCard label="Lesen" value={familyCounts.LICENSE} note="Annually renewable" />
                        <StatCard label="Permit" value={familyCounts.PERMIT} note="One-off temporary" />
                        <StatCard label="High risk" value={highRisk} note="Agency referrals mandatory" />
                    </div>

                    <div className="toolbar">
                        <div className="segmented" role="group" aria-label="Filter by family">
                            {FAMILIES.map(value => (
                                <button
                                    key={value ?? 'ALL'}
                                    type="button"
                                    className={family === value ? 'is-active' : undefined}
                                    aria-pressed={family === value}
                                    onClick={() => dispatch(LicenseTypeActions.setFamilyFilter({ family: value }))}
                                >
                                    {value === null ? 'All' : FAMILY_LABEL[value]}
                                </button>
                            ))}
                        </div>

                        <label className="field">
                            <span className="sr-only">Filter types</span>
                            <input
                                type="search"
                                placeholder="Filter by code or name…"
                                value={filter}
                                onChange={event =>
                                    dispatch(LicenseTypeActions.setLicenseTypeFilter({ filter: event.target.value }))
                                }
                            />
                        </label>

                        <p className="count">
                            <strong>{filtered.length.toLocaleString()}</strong>
                            {filtered.length === types.length ? ' types' : ` of ${types.length.toLocaleString()} types`}
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <EmptyState label="No type matches those filters." />
                    ) : (
                        <DataTable columns={COLUMNS} rows={filtered} rowKey={type => type.code} caption="License and permit types" />
                    )}
                </>
            )}
        </AppPage>
    );
}
