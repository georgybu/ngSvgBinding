import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3Selection from 'd3-selection';

@Component({
  selector: 'm-svg-loader',
  template: `
    <button (click)="loadScheme('schema')">Scheme 1</button>
    <button (click)="loadScheme('vcc')">Scheme 2</button>
    <div #scheme></div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
      background-color: white;
    }
  `]
})
export class SvgLoaderComponent implements OnInit, AfterViewInit {
  @ViewChild('scheme', {read: ElementRef}) scheme: ElementRef;

  public data = [
    {
      field: `MYFIELD1`,
      type: `string`,
      value: null
    },
    {
      field: `MYFIELD2`,
      type: `color`,
      value: null
    },
    {
      field: `CLRFLD1`,
      type: `color`,
      value: null
    },
    {
      field: `boaz`,
      type: `string`,
      value: null
    },
    {
      field: `MYMYMYMY`,
      type: `color`,
      value: null
    },
    {
      field: `BOBOBO`,
      type: `string`,
      value: null
    },
  ];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    setInterval(() => {
      this.data = this.generateData();
      this.updateData(this.data);
    }, 500);
  }

  ngAfterViewInit() {
    this.loadScheme(`vcc`);
  }

  loadScheme(scheme) {
    this.http.get(`/assets/${scheme}.svg`, {responseType: 'text'}).subscribe((response) => {
      this.scheme.nativeElement.innerHTML = response;
    });
  }

  generateData() {
    return this.data.map((dataItem) => {
      switch (dataItem.type) {
        case 'string':
          dataItem.value = this.getRandomInt(1000, 9999);
          break;
        case 'color':
          dataItem.value = this.getRandomColor();
          break;
        default:
          throw new Error(`Unknown data type ${JSON.stringify(dataItem)}`);
      }
      return dataItem;
    });
  }

  updateData(data: { field: string, type: string, value: any }[]) {
    const dataNodes = d3Selection.select(this.scheme.nativeElement)
      .selectAll('g[v\\:groupContext=foregroundPage] g')
      .select('v\\:cp[v\\:lbl=id]');

    dataNodes.each((nodeData, i, nodes) => {
      const el = <HTMLElement>nodes[i];
      const attrValue = this.getAttributeValue(el);

      /*
      Basic structure for element with custom property
      <g id="shapeXXX" v:mID="164" v:groupContext="shape" transform="translate(325.44,-623.16)">
        <v:custProps>
          <v:cp v:nameU="Row_2" v:lbl="id" v:type="0" v:langID="1033" v:val="VT4(MYFIELD1)"/>
        </v:custProps>
			</g>
       */
      const custProps = el.parentElement;
      const gElement = custProps.parentElement;

      data.forEach((dataItem) => {
        const element = d3Selection.select(gElement);
        if (dataItem.field === attrValue) {
          switch (dataItem.type) {
            case 'string':
              element.selectAll('text').text(dataItem.value);
              break;
            case 'color':
              if (dataItem.value) {
                element.selectAll('path').style('stroke', dataItem.value);
              }
              break;
            default:
              throw new Error(`Unknown data type ${JSON.stringify(dataItem)}`);
          }
        }
      });
    });
  }

  /**
   * This function get id value from v:cp SVG element
   *
   * <v:custProps>
   *    <v:cp v:nameU="Row_1" v:lbl="id" v:type="0" v:langID="1033" v:cal="0" v:val="VT4(MYFIELD1)"/>
   * </v:custProps>
   *
   * @param {HTMLElement} cp
   * @returns {string | null}
   */
  private getAttributeValue(cp: HTMLElement): string | null {
    if (cp.hasAttribute('v:val')) {
      const vVal = cp.getAttribute('v:val');
      const parentheses = /\(.+\)/g;
      const matches = vVal.match(parentheses);
      if (matches.length) {
        return matches[0].slice(1, matches[0].length - 1);
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * Get Random color
   * format: #000000
   *
   * @returns {string}
   */
  private getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /**
   * Returns a random integer between min (inclusive) and max (inclusive)
   * Using Math.round() will give you a non-uniform distribution!
   */
  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
