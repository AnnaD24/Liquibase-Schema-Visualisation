import {Injectable} from '@angular/core';
import {TableModel} from "../../model/table.model";
import {Colors, Figure, NodeModel} from "../../model/node.model";
import {FKModel} from "../../model/foreign-key.model";
import {LinkModel} from "../../model/link.model";
import {AddedColumnModel} from "../../model/added-column.model";
import {ColumnModel} from "../../model/column.model";

@Injectable({
  providedIn: 'root'
})
export class DiagramDataMappingService {

  constructor() { }

  mapTablesToNodes(tables: TableModel[]): NodeModel[] {
    return tables.map((item) => {
      return {
        key: item.snapshotId,
        name: item.name,
        items: item.columns.map((column) => {
          return {
            name: column.name,
            iskey: true, //todo
            figure: Figure.line, // Hardcoded figure
            color: Colors.gray
          };
        })
      };
    });
  }

  mapLinks(fkeys: FKModel[]): LinkModel[] {
    return fkeys.map((item) => {
      return {
        from: item.foreignKeyTableId,
        to: item.primaryKeyTableId,
        text: '1',
        toText: '1',
      }
    })
  }
}
