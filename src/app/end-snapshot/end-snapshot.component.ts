import {Component, inject} from '@angular/core';
import {Store} from "@ngrx/store";
import {Observable} from "rxjs";
import {SnapshotModel} from "../../model/snapshot.model";
import {selectEndSnapshot} from "../state/root/root.selectors";

@Component({
  selector: 'app-end-snapshot',
  templateUrl: './end-snapshot.component.html',
  styleUrls: ['./end-snapshot.component.scss']
})
export class EndSnapshotComponent {
  store = inject(Store)
  snapshot$: Observable<SnapshotModel | null> = this.store.select(selectEndSnapshot)
}
