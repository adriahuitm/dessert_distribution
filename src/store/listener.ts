import { createListenerMiddleware, addListener } from '@reduxjs/toolkit';
import type { TypedStartListening, TypedAddListener } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from './index';

/**
 * RTK's listener middleware is this template's stand-in for NgRx effects: it
 * watches dispatched actions and runs async work beside the reducer, with the
 * same rule that only actions go in and only actions come out.
 *
 * The one idiom worth naming: `listenerApi.cancelActiveListeners()` at the top
 * of an effect gives `switchMap` semantics — a second dispatch abandons the
 * first in-flight run instead of racing it to the reducer. Every effect in this
 * template opens with it, because every one of them is a load.
 */
export const listenerMiddleware = createListenerMiddleware();

export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export const startAppListening = listenerMiddleware.startListening as AppStartListening;
export const addAppListener = addListener as TypedAddListener<RootState, AppDispatch>;
