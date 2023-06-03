import { Injectable } from '@angular/core';
import {EnvironmentService} from "../util/environment.service";
import {HttpClient} from "@angular/common/http";
import {SnapshotModel} from "../model/snapshot.model";
import {Observable} from "rxjs";
import {AddedColumnModel} from "../model/added-column.model";
import {DiffResponseModel} from "../model/diff-response.model";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  url: string = ''
  constructor(private env: EnvironmentService, private httpClient: HttpClient) {
    this.url = env.apiUrl;
  }

  getStartSnapshot(date: string): Observable<SnapshotModel> {
    return this.httpClient.get<SnapshotModel>(this.url + `start-snapshot?date=${date}`)
  }

  getEndSnapshot(date: string): Observable<SnapshotModel> {
    return this.httpClient.get<SnapshotModel>(this.url + `end-snapshot?date=${date}`)
  }

  getDiff(): Observable<DiffResponseModel> {
    return this.httpClient.get<DiffResponseModel>(this.url + 'diff')
  }
}
