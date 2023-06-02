import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';
import * as fromRoot from '../root/root.reducer';


export interface State {

  [fromRoot.rootFeatureKey]: fromRoot.State;
}

export const reducers: ActionReducerMap<State> = {

  [fromRoot.rootFeatureKey]: fromRoot.reducer,
};
