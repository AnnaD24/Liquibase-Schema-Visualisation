import { createFeature, createReducer, on } from '@ngrx/store';
import {DateActions, EndSnapshotActions, StartSnapshotActions} from './root.actions';
import {SnapshotModel} from "../../../model/snapshot.model";

export const rootFeatureKey = 'root';

export interface State {
  startDate: string,
  endDate: string,
  startSnapshot: SnapshotModel | null,
  endSnapshot: SnapshotModel | null,
}

export const initialState: State = {
  startDate: '',
  endDate: '',
  startSnapshot: null,
  endSnapshot: null
};

export const reducer = createReducer(
  initialState,
  on(DateActions.setStartDate, (state, action) => ({...state, startDate: action.date})),
  on(DateActions.setEndDate, (state, action) => ({...state, endDate: action.date})),
  on(StartSnapshotActions.loadSuccess, (state, action) => ({...state, startSnapshot: action.snapshot})),
  on(StartSnapshotActions.loadError, (state) => ({...state, startSnapshot: null})),
  on(EndSnapshotActions.loadSuccess, (state, action) => ({...state, endSnapshot: action.snapshot})),
  on(EndSnapshotActions.loadError, (state) => ({...state, endSnapshot: null})),
);

export const rootFeature = createFeature({
  name: rootFeatureKey,
  reducer,
});

