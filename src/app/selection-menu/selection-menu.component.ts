import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormControl} from "@angular/forms";
import {FetchDataService} from "../../service/fetch-data.service";
import {Store} from "@ngrx/store";
import {DateActions} from "../state/root/root.actions";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-selection-menu',
  templateUrl: './selection-menu.component.html',
  styleUrls: ['./selection-menu.component.scss'],
  providers: [DatePipe]
})
export class SelectionMenuComponent implements OnInit{
  startDate: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  endDate: FormControl<string> = new FormControl<string>('', {nonNullable: true});

  store = inject(Store)


  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.startDate.valueChanges.subscribe(value => {
      const formattedDate: string = this.datePipe.transform(value, 'yyyy-MM-dd') as string;
      this.store.dispatch(DateActions.setStartDate({date: formattedDate}))
    })
    this.endDate.valueChanges.subscribe(value => {
      const formattedDate: string = this.datePipe.transform(value, 'yyyy-MM-dd') as string;
      this.store.dispatch(DateActions.setEndDate({date: formattedDate}))
    })
  }

}
