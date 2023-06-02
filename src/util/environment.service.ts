import { Injectable } from '@angular/core';
import {environment} from "../environments";

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  get apiUrl() {
    return environment.apiUrl;
  }
  constructor() {}
}
