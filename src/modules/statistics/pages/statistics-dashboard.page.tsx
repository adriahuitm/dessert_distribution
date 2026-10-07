'use client';

import { useEffect } from 'react';
import { AppPage } from '@shared/components/app-page';
import { CountBreakdown, StatCard } from '@shared/components/stat-card';
import { ErrorState, LoadingState } from '@shared/components/status-message';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { CREDENTIAL_STATUS_DESCRIPTION, STAGE_DESCRIPTION } from '@shared/models/statistics.model';
import * as StatisticsActions from '../store/statistics.action';
import {
    selectApplicationTotal,
    selectCredentialTotal,
    selectLoadedAt,
    selectRetryAfterSeconds,
    selectStatistics,
    selectStatisticsError,
    selectStatisticsLoading,
} from '../store/statistics.selector';

export function StatisticsDashboardPage() {
    const dispatch = useAppDispatch();

    const statistics = useAppSelector(selectStatistics);
    const credentialTotal = useAppSelector(selectCredentialTotal);
    const applicationTotal = useAppSelector(selectApplicationTotal);
    const loading = useAppSelector(selectStatisticsLoading);
    const error = useAppSelector(selectStatisticsError);
    const retryAfterSeconds = useAppSelector(selectRetryAfterSeconds);
    const loadedAt = useAppSelector(selectLoadedAt);

    useEffect(() => {
        if (!statistics) dispatch(StatisticsActions.loadStatistics());
    }, [dispatch, statistics]);

    return (
        <AppPage
            eyebrow="Live"
            title="Licensing at a glance"
            lead={
                <>
                    Operational counts computed from the council&apos;s current database state at
                    call time — no caching upstream, so a reload genuinely re-reads. Non-financial
                    by design: the sandbox publishes workload, never revenue.
                </>
            }
            actions={
                <button
                    type="button"
                    className="btn"
                    onClick={() => dispatch(StatisticsActions.loadStatistics())}
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
                    onRetry={() => dispatch(StatisticsActions.loadStatistics())}
                />
            ) : !statistics ? (
                <LoadingState label="Reading live counts…" />
            ) : (
                <>
                    <div className="stat-row">
                        <StatCard label="Credentials" value={credentialTotal.toLocaleString()} note="All lifecycle statuses" />
                        <StatCard label="Applications" value={applicationTotal.toLocaleString()} note="Licenses and permits" />
                        <StatCard
                            label="Expiring soon"
                            value={statistics.expiringSoonCount.toLocaleString()}
                            note="Active, ending within 30 days"
                        />
                        <StatCard
                            label="Inspections pending"
                            value={statistics.inspectionPendingCount.toLocaleString()}
                            note={`${statistics.inspectionCompletedCount.toLocaleString()} completed all-time`}
                        />
                    </div>

                    <div className="panel-grid">
                        <CountBreakdown
                            title="Credentials by status"
                            counts={statistics.credentialStatusCounts}
                            describe={key => CREDENTIAL_STATUS_DESCRIPTION[key]}
                        />
                        <CountBreakdown
                            title="License applications by stage"
                            counts={statistics.licenseApplicationStageCounts}
                            describe={key => STAGE_DESCRIPTION[key]}
                        />
                        <CountBreakdown
                            title="Permit applications by stage"
                            counts={statistics.permitApplicationStageCounts}
                            describe={key => STAGE_DESCRIPTION[key]}
                        />
                    </div>

                    {loadedAt ? (
                        <p className="foot-note">
                            As at {new Date(loadedAt).toLocaleTimeString()} · read live from the sandbox
                        </p>
                    ) : null}
                </>
            )}
        </AppPage>
    );
}
