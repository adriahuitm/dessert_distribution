import { configureStore } from '@reduxjs/toolkit';
import { listenerMiddleware } from './listener';

import { zoneReducer } from '@modules/zone/store/zone.reducer';
import { licenseTypeReducer } from '@modules/license-type/store/license-type.reducer';
import { businessActivityReducer } from '@modules/business-activity/store/business-activity.reducer';
import { statisticsReducer } from '@modules/statistics/store/statistics.reducer';

import { startZoneListeners } from '@modules/zone/store/zone.effect';
import { startLicenseTypeListeners } from '@modules/license-type/store/license-type.effect';
import { startBusinessActivityListeners } from '@modules/business-activity/store/business-activity.effect';
import { startStatisticsListeners } from '@modules/statistics/store/statistics.effect';

/**
 * Root store. Feature reducers are registered under the same keys the feature
 * selectors read (`createFeatureSelector`'s job in NgRx) — keep the key and the
 * selector's slice name in step.
 */
export const makeStore = () => {
    const store = configureStore({
        reducer: {
            zone: zoneReducer,
            licenseType: licenseTypeReducer,
            businessActivity: businessActivityReducer,
            statistics: statisticsReducer,
        },
        middleware: getDefault => getDefault().prepend(listenerMiddleware.middleware),
    });

    // The equivalent of NgRx's `EffectsModule.forFeature` registrations.
    startZoneListeners();
    startLicenseTypeListeners();
    startBusinessActivityListeners();
    startStatisticsListeners();

    return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
