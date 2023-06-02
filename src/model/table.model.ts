import {ColumnModel} from "./column.model";

export interface TableModel {
  name: string;
  snapshotId: string;
  columns: ColumnModel[];
  outgoingForeignKeys: string[];
  primaryKey: string
}
