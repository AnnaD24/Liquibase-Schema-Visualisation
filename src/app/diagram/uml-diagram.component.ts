import {AfterViewInit, Component, ElementRef, inject, Input, OnInit, ViewChild} from '@angular/core';
import * as go from 'gojs';
import {TableModel} from "../../model/table.model";
import {DiagramDataMappingService} from "./diagram-data-mapping.service";
import {Figure, NodeModel} from "../../model/node.model";
import {LinkModel} from "../../model/link.model";
import {FKModel} from "../../model/foreign-key.model";
import {Store} from "@ngrx/store";
import {filter, Observable} from "rxjs";
import {SnapshotModel} from "../../model/snapshot.model";
import {selectDiff, selectEndSnapshot} from "../state/root/root.selectors";
import {AddedColumnModel} from "../../model/added-column.model";
import {map, tap} from "rxjs/operators";

const $ = go.GraphObject.make;

@Component({
  selector: 'app-uml-diagram',
  templateUrl: './uml-diagram.component.html',
  styleUrls: ['./uml-diagram.component.scss']
})
export class UmlDiagramComponent implements OnInit, AfterViewInit{
  @ViewChild('diagramDiv', { static: false }) diagramDiv!: ElementRef;

  @Input()
  tables: TableModel[] = [];

  @Input()
  fkeys: FKModel[] = [];

  nodeDataArray: NodeModel[] = [];
  linkDataArray: LinkModel[] = [];

  store = inject(Store)
  diff$: Observable<AddedColumnModel[]> = this.store.select(selectDiff)

  myDiagram: go.Diagram | undefined;

  constructor(private mappingService: DiagramDataMappingService) {
  }

  itemTempl =
    $(go.Panel, "Horizontal",
      $(go.Shape,
        { desiredSize: new go.Size(15, 15), strokeJoin: "round", strokeWidth: 3, stroke: null, margin: 2 },
        new go.Binding("figure", "figure"),
        new go.Binding("fill", "color"),
        new go.Binding("stroke", "color")),
      $(go.TextBlock,
        {
          stroke: "#333333",
          font: "bold 14px sans-serif"
        },
        new go.Binding("text", "name"))
    );

  colors = {
    'red': '#ff3a3a',
    'green': '#52ce60',
    'blue': '#4286ff',
    'lightred': '#ffbebe',
    'lightblue': '#afd4fe',
    'lightgreen': '#b9e986',
    'pink': '#faadc1',
    'purple': '#d689ff',
    'orange': '#fdb400',
    'gray': '#676767',
    'white': '#eeeeee',
  }

  ngOnInit(): void {
    this.diff$.pipe(
      filter(diff => diff.length > 0),
      tap(diff => this.updateNodes(diff)),
    ).subscribe()
    this.mapDataToDiagram()
  }

  updateNodes(diff?: AddedColumnModel[]) {
    diff?.forEach(addedCol => {
      const tableToUpdate = this.myDiagram?.findNodesByExample({name: addedCol.tableName}).first()
      console.log(this.myDiagram?.findNodesByExample({name: addedCol.tableName}))
      if (tableToUpdate) {
        this.myDiagram!.model.commit(m => {
          m.set(tableToUpdate, "isHighlighted", true);
          const items = tableToUpdate.data.items.filter((column: any) => column.name === addedCol.colName)
          console.log(items[0])
          if(items.length > 0) {
            m.set(items[0], "color", "green");
          }
        }, "flash");
      }
    })
  }

  mapDataToDiagram() {
    this.nodeDataArray = this.mappingService.mapTablesToNodes(this.tables);
    this.linkDataArray = this.mappingService.mapLinks(this.fkeys)
  }

  ngAfterViewInit(): void {
    this.initializeDiagram();
  }

  initializeDiagram() {

    this.myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
      allowDelete: false,
      allowCopy: false,
      layout: $(go.LayeredDigraphLayout, {
        setsPortSpots: false, // Disable automatic spot assignment for links
        direction: 90, // Specify the direction of the layout
        layerSpacing: 100, // Adjust the spacing between layers
        columnSpacing: 50, // Adjust the spacing between columns
        packOption: go.LayeredDigraphLayout.PackStraighten,
      }),
      initialAutoScale: go.Diagram.Uniform,
      "undoManager.isEnabled": true
    });

    this.myDiagram.click = e => {
      e.diagram.commit(d => d.clearHighlighteds(), "no highlighteds");
    };

    this.myDiagram.model = new go.GraphLinksModel(
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: this.nodeDataArray,
        linkDataArray: this.linkDataArray
      });


    this.myDiagram.nodeTemplate =
      $(go.Node, "Auto",  // the whole node panel
        {
          selectionAdorned: true,
          resizable: true,
          layoutConditions: go.Part.LayoutStandard & ~go.Part.LayoutNodeSized,
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          isShadowed: true,
          shadowOffset: new go.Point(3, 3),
          shadowColor: "#C5C1AA",
          click: (e, node) => {
            // highlight all Links and Nodes coming out of a given Node
            const diagram = node.diagram!
            const nodeRef = node as go.Node

            diagram.startTransaction("highlight");
            // remove any previous highlighting
            diagram.clearHighlighteds();
            nodeRef.isHighlighted = true;
            console.log(nodeRef)
            // // for each Link coming out of the Node, set Link.isHighlighted
            nodeRef.findLinksConnected().each(l => l.isHighlighted = true);
            // // for each Node destination for the Node, set Node.isHighlighted
            nodeRef.findNodesConnected().each(l => l.isHighlighted = true);
            diagram.commitTransaction("highlight");
          }
        },
        new go.Binding("location", "location").makeTwoWay(),
        // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
        // clear out any desiredSize set by the ResizingTool.
        new go.Binding("desiredSize", "visible", v => new go.Size(NaN, NaN)).ofObject("LIST"),
        // define the node's outer shape, which will surround the Table
        $(go.Shape, "RoundedRectangle",
          { fill: this.colors.white, stroke: this.colors.white, strokeWidth: 2, name: "RECTANGLE" },
          new go.Binding("stroke", "isHighlighted", h => h ? this.colors.red : this.colors.white)
            .ofObject(),
          new go.Binding("strokeWidth", "isHighlighted", h => h ? 6 : 2)
            .ofObject(),
          new go.Binding("fill", "isHighlighted", h => h ? this.colors.lightred : this.colors.white)
            .ofObject()
        ),
        $(go.Panel, "Table",
          { margin: 8, stretch: go.GraphObject.Fill },
          $(go.RowColumnDefinition, { row: 0, sizing: go.RowColumnDefinition.None }),
          // the table header
          $(go.TextBlock,
            {
              row: 0, alignment: go.Spot.Center,
              margin: new go.Margin(0, 24, 0, 2),  // leave room for Button
              font: "bold 16px sans-serif"
            },
            new go.Binding("text", "name")),
          // the collapse/expand button
          $("PanelExpanderButton", "LIST",  // the name of the element whose visibility this button toggles
            { row: 0, alignment: go.Spot.TopRight }),
          // the list of Panels, each showing an attribute
          $(go.Panel, "Vertical",
            {
              name: "LIST",
              row: 1,
              padding: 3,
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              stretch: go.GraphObject.Horizontal,
              itemTemplate: this.itemTempl
            },
            new go.Binding("itemArray", "items"))
        )  // end Table Panel
      );  // end Node

    // define the Link template, representing a relationship
    this.myDiagram.linkTemplate =
      $(go.Link,  // the whole link panel
        {
          selectionAdorned: true,
          layerName: "Foreground",
          reshapable: true,
          routing: go.Link.AvoidsNodes,
          corner: 5,
          curve: go.Link.JumpOver
        },
        $(go.Shape,  // the link shape
          { stroke: this.colors.gray, strokeWidth: 2 },
          new go.Binding("strokeWidth", "isHighlighted", h => h ? 6 : 2)
            .ofObject(),
          new go.Binding("stroke", "isHighlighted", h => h ? this.colors.red : this.colors.gray)
            .ofObject(),
        ),
      );
  }
}
