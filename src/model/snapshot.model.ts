import {TableModel} from "./table.model";
import {FKModel} from "./foreign-key.model";

export interface SnapshotModel {
  tables: TableModel[]
  foreign_keys: FKModel[]
  created: string;
}
