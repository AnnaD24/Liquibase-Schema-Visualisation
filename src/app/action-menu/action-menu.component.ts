import {Component, inject} from '@angular/core';
import {DiffActions} from "../state/root/root.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent {

  store = inject(Store)

  compareSnapshots() {
    this.store.dispatch(DiffActions.requestDiff())
  }
}
