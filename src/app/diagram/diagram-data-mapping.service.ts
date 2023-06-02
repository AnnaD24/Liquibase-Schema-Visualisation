import {Injectable} from '@angular/core';
import {TableModel} from "../../model/table.model";
import * as go from 'gojs';
import {Colors, Figure, NodeModel} from "../../model/node.model";
import {FKModel} from "../../model/foreign-key.model";
import {LinkModel} from "../../model/link.model";

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
            figure: Figure.hexagon, // Hardcoded figure
            color: Colors.lightgreen // Hardcoded color
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
