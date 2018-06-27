import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

declare const mxGraph;
declare const mxPoint;

@Component({
  selector: 'm-mxg',
  template: `
    <div #mxContainer></div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class MxgComponent implements OnInit, AfterViewInit {
  @ViewChild('mxContainer', {read: ElementRef}) mxContainer: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    const graph = new mxGraph(this.mxContainer.nativeElement);
    graph.setEnabled(false);
    const parent = graph.getDefaultParent();

    const vertexStyle = `shape=cylinder;strokeWidth=2;fillColor=#ffffff;strokeColor=black;gradientColor=#a0a0a0;fontColor=black;fontStyle=1;spacingTop=14;`;
    const edgeStyle = `strokeWidth=3;endArrow=block;endSize=2;endFill=1;strokeColor=black;rounded=1;`;

    graph.getModel().beginUpdate();

    const v1 = graph.insertVertex(parent, null, 'Pump', 20, 20, 60, 60, vertexStyle);
    const v2 = graph.insertVertex(parent, null, 'Tank', 200, 150, 60, 60, vertexStyle);
    const e1 = graph.insertEdge(parent, null, '', v1, v2, edgeStyle);
    e1.geometry.points = [new mxPoint(230, 50)];

    try {
      graph.orderCells(true, [e1]);
    }
    finally {
      // Updates the display
      graph.getModel().endUpdate();
    }

    // Adds animation to edge shape and makes "pipe" visible
    const state = graph.view.getState(e1);
    state.shape.node.getElementsByTagName('path')[0].removeAttribute('visibility');
    state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke-width', '6');
    state.shape.node.getElementsByTagName('path')[0].setAttribute('stroke', 'lightGray');
    state.shape.node.getElementsByTagName('path')[1].setAttribute('class', 'flow');

  }

}
