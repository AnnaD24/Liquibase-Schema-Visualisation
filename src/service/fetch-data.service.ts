import { Injectable } from '@angular/core';
import {EnvironmentService} from "../util/environment.service";
import {HttpClient} from "@angular/common/http";
import {SnapshotModel} from "../model/snapshot.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {
  url: string = ''
  constructor(private env: EnvironmentService, private httpClient: HttpClient) {
    this.url = env.apiUrl;
  }

  getOneSnapshot(date: string): Observable<SnapshotModel> {
    return this.httpClient.get<SnapshotModel>(this.url + `snapshot?date=${date}`)
  }

  getDiff() {
    return this.httpClient.get(this.url + 'diff')
  }
}
