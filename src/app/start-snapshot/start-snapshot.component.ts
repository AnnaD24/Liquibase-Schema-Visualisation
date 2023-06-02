import {Component, inject} from '@angular/core';
import {SnapshotModel} from "../../model/snapshot.model";
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {selectStartSnapshot} from "../state/root/root.selectors";

@Component({
  selector: 'app-start-snapshot',
  templateUrl: './start-snapshot.component.html',
  styleUrls: ['./start-snapshot.component.scss']
})
export class StartSnapshotComponent {
  store = inject(Store)
  snapshot$: Observable<SnapshotModel | null> = this.store.select(selectStartSnapshot)



}
