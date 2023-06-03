import { createFeature, createReducer, on } from '@ngrx/store';
import {DateActions, DiffActions, EndSnapshotActions, StartSnapshotActions} from './root.actions';
import {SnapshotModel} from "../../../model/snapshot.model";
import {AddedColumnModel} from "../../../model/added-column.model";

export const rootFeatureKey = 'root';

export interface State {
  startDate: string,
  endDate: string,
  startSnapshot: SnapshotModel | null,
  endSnapshot: SnapshotModel | null,
  diff: AddedColumnModel[]
}

export const initialState: State = {
  startDate: '',
  endDate: '',
  startSnapshot: null,
  endSnapshot: null,
  diff: []
};

export const reducer = createReducer(
  initialState,
  on(DateActions.setStartDate, (state, action) => ({...state, startDate: action.date})),
  on(DateActions.setEndDate, (state, action) => ({...state, endDate: action.date})),
  on(StartSnapshotActions.loadSuccess, (state, action) => ({...state, startSnapshot: action.snapshot})),
  on(StartSnapshotActions.loadError, (state) => ({...state, startSnapshot: null})),
  on(EndSnapshotActions.loadSuccess, (state, action) => ({...state, endSnapshot: action.snapshot})),
  on(EndSnapshotActions.loadError, (state) => ({...state, endSnapshot: null})),
  on(DiffActions.loadSuccess, (state, action) => ({...state, diff: action.addedCols})),
  on(DiffActions.loadError, (state) => ({...state, diff: []})),
);

export const rootFeature = createFeature({
  name: rootFeatureKey,
  reducer,
});

