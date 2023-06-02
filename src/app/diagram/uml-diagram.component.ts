import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import * as go from 'gojs';
import {TableModel} from "../../model/table.model";
import {DiagramDataMappingService} from "./diagram-data-mapping.service";
import {NodeModel} from "../../model/node.model";
import {LinkModel} from "../../model/link.model";
import {FKModel} from "../../model/foreign-key.model";

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
    'red': '#be4b15',
    'green': '#52ce60',
    'blue': '#6ea5f8',
    'lightred': '#fd8852',
    'lightblue': '#afd4fe',
    'lightgreen': '#b9e986',
    'pink': '#faadc1',
    'purple': '#d689ff',
    'orange': '#fdb400',
  }

  ngOnInit(): void {
    console.log(this.fkeys)
    this.nodeDataArray = this.mappingService.mapTablesToNodes(this.tables);
    this.linkDataArray = this.mappingService.mapLinks(this.fkeys)
  }

  ngAfterViewInit(): void {
    this.initializeDiagram();
  }
   mouseEnter(e:any, obj: any) {
    const shape = obj.findObject("RECTANGLE");
    shape.fill = "#6DAB80";
    shape.stroke = "#A6E6A1";
  };

  mouseLeave(e:any, obj:any) {
    const shape = obj.findObject("RECTANGLE");
    // Return the Shape's fill and stroke to the defaults
    shape.fill = "white";
    shape.stroke = "#eeeeee";
  };

  initializeDiagram() {

    const myDiagram = $(go.Diagram, this.diagramDiv.nativeElement, {
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

    myDiagram.model = new go.GraphLinksModel(
      {
        copiesArrays: true,
        copiesArrayObjects: true,
        nodeDataArray: this.nodeDataArray,
        linkDataArray: this.linkDataArray
      });


    myDiagram.nodeTemplate =
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
          mouseEnter: this.mouseEnter,
          mouseLeave: this.mouseLeave
        },
        new go.Binding("location", "location").makeTwoWay(),
        // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
        // clear out any desiredSize set by the ResizingTool.
        new go.Binding("desiredSize", "visible", v => new go.Size(NaN, NaN)).ofObject("LIST"),
        // define the node's outer shape, which will surround the Table
        $(go.Shape, "RoundedRectangle",
          { fill: 'white', stroke: "#eeeeee", strokeWidth: 2, name: "RECTANGLE" }),
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
    myDiagram.linkTemplate =
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
          { stroke: "#303B45", strokeWidth: 2.5 }),
        $(go.TextBlock,  // the "from" label
          {
            textAlign: "center",
            font: "bold 14px sans-serif",
            stroke: "#1967B3",
            segmentIndex: 0,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright
          },
          new go.Binding("text", "text")),
        $(go.TextBlock,  // the "to" label
          {
            textAlign: "center",
            font: "bold 14px sans-serif",
            stroke: "#1967B3",
            segmentIndex: -1,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright
          },
          new go.Binding("text", "toText"))
      );
  }
}
