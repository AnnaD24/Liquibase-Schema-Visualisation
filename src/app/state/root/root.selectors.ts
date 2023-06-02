import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromRoot from './root.reducer';

export const selectRootState = createFeatureSelector<fromRoot.State>(
  fromRoot.rootFeatureKey
);

export const selectStartSnapshot = createSelector(selectRootState, (param) => (param.startSnapshot))
export const selectEndSnapshot = createSelector(selectRootState, (param) => (param.endSnapshot))


