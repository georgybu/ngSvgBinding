import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3Selection from 'd3-selection';
import * as d3 from 'd3';
import { Point, toPoints } from 'svg-points';

@Component({
  selector: 'm-svg-loader',
  template: `
    <button (click)="loadScheme('scheme')">Scheme 1</button>
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
    {
      field: `openclose1`,
      type: `switch`,
      value: null // open|close
    },
    {
      field: `openclose2`,
      type: `switch`,
      value: null // open|close
    },
    {
      field: `openclose3`,
      type: `switch`,
      value: null // open|close
    },
    {
      field: `openclose4`,
      type: `switch`,
      value: null // open|close
    },
    {
      field: `openclose5`,
      type: `switch`,
      value: null // open|close
    },
    {
      field: `openclose8`,
      type: `switch`,
      value: null // open|close
    }
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
    this.loadScheme(`scheme`);
  }

  loadScheme(scheme) {
    this.http.get(`./assets/${scheme}.svg`, {responseType: 'text'}).subscribe((response) => {
      this.scheme.nativeElement.innerHTML = response;
      this.data = this.generateData();
      this.updateData(this.data);
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
        case 'switch':
          dataItem.value = Math.random() > 0.5 ? 'close' : 'open';
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
            case 'switch':
              console.group(`${JSON.stringify(dataItem)}`);
              const switchElements = [];
              element.selectAll('path').each((pathNodeData, pathI, pathNodes) => {
                const el = <SVGGraphicsElement>pathNodes[pathI];
                const elPoints = this.getPointsFromPath(el);
                switchElements.push(el);
                console.log(el, elPoints);
              });
              const openCloseElement = this.getOpenCloseElement(switchElements);
              console.log(gElement, openCloseElement, this.getPointsFromPath(openCloseElement));

              if (dataItem.value === 'open') {
                this.openSwitch(openCloseElement);
              }
              if (dataItem.value === 'close') {
                this.closeSwitch(openCloseElement);
              }
              console.groupEnd();
              break;
            default:
              throw new Error(`Unknown data type ${dataItem.type} for ${JSON.stringify(dataItem)}`);
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

  /**
   * Get element, that we need to mutate
   * @param {SVGGraphicsElement[]} paths
   * @returns {SVGGraphicsElement | null}
   */
  private getOpenCloseElement(paths: SVGGraphicsElement[]): SVGGraphicsElement | null {
    if (paths.length) {
      // temporary return latest element
      /*
            if (paths.length !== 3) {
              return paths[paths.length - 1];
            } else {
              // Math.floor(el.getBBox().y)
              return paths[paths.length - 1];
            }
      */
      return paths[paths.length - 1];
    } else {
      return null;
    }
  }

  /**
   * Get points from svg path
   *      <path d="M0 799.2 L-24.12 799.2" class="st2"></path>
   *
   * @param {SVGGraphicsElement} path
   * @returns {module:svg-points.Point[]}
   */
  private getPointsFromPath(path: SVGGraphicsElement): Point[] {
    if (path.hasAttribute('d')) {
      const d = path.getAttribute('d');
      return toPoints({type: 'path', d});
    } else {
      return [];
    }
  }

  /**
   * Is element rotated
   * @param {SVGGraphicsElement} g
   * @returns {boolean}
   */
  private isRotated(g: SVGGraphicsElement): boolean {
    if (g.hasAttribute('transform')) {
      const transform = g.getAttribute('transform');
      return transform.indexOf('rotate(90)') > -1;
    } else {
      return false;
    }
  }

  private isOpen(path: SVGGraphicsElement): boolean | null {
    const points = this.getPointsFromPath(path);
    if (points.length) {
      const y = points[0].y;
      for (let i = 0; i < points.length; i++) {
        if (points[i].y !== y) {
          return true;
        }
      }
    }
    return false;
  }

  private openSwitch(path: SVGGraphicsElement) {
    this.changeSwitchState(path, 'open');
  }

  private closeSwitch(path: SVGGraphicsElement) {
    this.changeSwitchState(path, 'close');
  }

  private changeSwitchState(path, state: 'open' | 'close') {
    const points = this.getPointsFromPath(path);
    if (points.length) {
      const y = points[1].y;
      const line = d3.line();
      const data: [number, number][] = [[points[0].x, state === 'open' ? y - 5 : y], [points[1].x, y]];
      d3.select(path)
        .transition()
        .duration(500)
        .attr('d', line(data));
    }
  }

}
