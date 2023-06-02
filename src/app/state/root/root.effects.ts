import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {catchError, map, concatMap, tap} from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import {DateActions, EndSnapshotActions, StartSnapshotActions} from './root.actions';
import {FetchDataService} from "../../../service/fetch-data.service";


@Injectable()
export class RootEffects {

  loadStartSnapshot$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DateActions.setStartDate),
      concatMap((action) =>
        this.fetchService.getOneSnapshot(action.date).pipe(
          map(data => StartSnapshotActions.loadSuccess({ snapshot: data })),
          catchError(error => of(StartSnapshotActions.loadError())))
      )
    );
  });

  loadEndSnapshot$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(DateActions.setEndDate),
      concatMap((action) =>
        this.fetchService.getOneSnapshot(action.date).pipe(
          map(data => EndSnapshotActions.loadSuccess({ snapshot: data })),
          catchError(error => of(EndSnapshotActions.loadError())))
      )
    );
  });


  constructor(private actions$: Actions, private fetchService: FetchDataService) {}
}
