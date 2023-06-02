import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {FetchDataService} from "../service/fetch-data.service";
import {SelectionMenuComponent} from './selection-menu/selection-menu.component';
import {ActionMenuComponent} from './action-menu/action-menu.component';
import {HeightDirective} from './height.directive';
import {CalendarModule} from "primeng/calendar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SplitterModule} from "primeng/splitter";
import {StoreModule} from '@ngrx/store';
import {reducers} from './state/reducers';
import * as fromRoot from './state/root/root.reducer';
import {EffectsModule} from '@ngrx/effects';
import {RootEffects} from './state/root/root.effects';
import {EndSnapshotComponent} from './end-snapshot/end-snapshot.component';
import {StartSnapshotComponent} from "./start-snapshot/start-snapshot.component";
import {GojsAngularModule} from "gojs-angular";
import {UmlDiagramComponent} from "./diagram/uml-diagram.component";

@NgModule({
  declarations: [
    AppComponent,
    SelectionMenuComponent,
    ActionMenuComponent,
    EndSnapshotComponent,
    StartSnapshotComponent,
    HeightDirective,
    UmlDiagramComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CalendarModule,
    FormsModule,
    BrowserAnimationsModule,
    SplitterModule,
    ReactiveFormsModule,
    StoreModule.forRoot(reducers),
    StoreModule.forFeature(fromRoot.rootFeatureKey, fromRoot.reducer),
    EffectsModule.forFeature([RootEffects]),
    EffectsModule.forRoot([]),
    GojsAngularModule
  ],
  providers: [FetchDataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
