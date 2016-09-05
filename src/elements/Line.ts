import { create, getColor } from '../util';
import BaseElement from './BaseElement';
import Node from './node/Node';
import Point from './Point';

export default class Line implements BaseElement {

  public static FORMAT = { SOLID: 'SOLID', DOTTED: 'DOTTED', PATH: 'PATH' };
  public source: Point;
  public target: Point;
  public color: string;
  private line: string;
  private path: string;
  private angle: number;

  constructor(source?: Point, target?: Point, line?: string, color?: string) {
    this.source = source;
    this.target = target;
    this.line = line;
    this.color = color;
  }

  public getTyp(): string {
    return 'SVG';
  }

  public getPos() {
    let pos = new Point();
    pos.center(this.source, this.target);
    return pos;
  };

  public getSize() {
    let pos = new Point();
    pos.size(this.source, this.target);
    return pos;
  }

  public withColor(color: string): Line {
    this.color = color;
    return this;
  }

  public withSize(x: number, y: number): BaseElement {
    return this;
  }

  public getCenter(): Point {
    let pos = this.getPos();
    let size = this.getSize();
    return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
  }

  public withPath(path: Array<Point>, close, angle?: any): Line {
    let i: number, d: string = 'M' + path[0].x + ' ' + path[0].y;
    this.line = Line.FORMAT.PATH; // It is a Path not a Line
    for (i = 1; i < path.length; i += 1) {
      d = d + 'L ' + path[i].x + ' ' + path[i].y;
    }
    if (close) {
      d = d + ' Z';
      this.target = path[0];
    } else {
      this.target = path[path.length - 1];
    }
    this.path = d;
    if (angle instanceof Number) {
      this.angle = angle;
    } else if (angle) {
      // let lineangle, start = path[0], end = path[path.length - 1];
      // lineangle = Math.atan2(end.y - start.y, end.x - start.x);
    }
    return this;
  };

  public draw(): HTMLElement {
    if (this.line === 'PATH') {
      return create({
        tag: 'path',
        'd': this.path,
        'fill': this.color,
        stroke: '#000',
        'stroke-width': '1px'
      });
    }
    let line = create({
      tag: 'line',
      'x1': this.source.x,
      'y1': this.source.y,
      'x2': this.target.x,
      'y2': this.target.y,
      'stroke': getColor(this.color)
    });
    if (this.line && this.line.toLowerCase() === 'dotted') {
      line.setAttribute('stroke-miterlimit', '4');
      line.setAttribute('stroke-dasharray', '1,1');
    }
    return line;
  }

  public getEvent() {
    return new String[0];
  }

  public fireEvent(source: Node, typ: string, value: Object) {
    // TODO
  }

  public event(source: Node, typ: string, value: Object): boolean {
    return true;
  }

}
