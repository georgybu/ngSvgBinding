import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'm-svg-viewer',
  template: `
    <div #scheme></div>
  `,
  styles: [`
    :host {
      display: block;
      width: 400px;
      height: 400px;
    }
  `]
})
export class SvgViewerComponent implements OnInit, AfterViewInit {
  @ViewChild('scheme', {read: ElementRef}) scheme: ElementRef;

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const main_chart_div = d3.select('body').append('div');
    // const el = d3.select(this.scheme.nativeElement);

    const url = `https://upload.wikimedia.org/wikipedia/commons/a/a0/Circle_-_black_simple.svg`;

    // d3.xml('/assets/schema.svg', function (error, documentFragment) {
    //
    //   console.log(error, documentFragment);
    //
    //   if (error) {
    //     console.log(error);
    //     return;
    //   }
    //
    //   const svgNode = documentFragment.getElementsByTagName('svg')[0];
    //   main_chart_div.node().appendChild(svgNode);
    //   el.node().appendChild(svgNode);
    // });
    d3.xml(url, function (error, documentFragment) {

      console.log(error, documentFragment);

      if (error) {
        console.log(error);
        return;
      }

      const svgNode = documentFragment.getElementsByTagName('svg')[0];
      // main_chart_div.node().appendChild(svgNode);
      // el.node().appendChild(svgNode);
    });

  }

}
