import { DiagramElement, Point } from '../BaseElements';
import { Node } from '../nodes';

export const enum Direction {
  Up,
  Down,
  Left,
  Right
}

export class Edge extends DiagramElement {

  public source: Node;
  public target: Node;
  public lineStyle: string;
  public points: Point[];

  constructor(type?: string, id?: string) {
    super();
    this.type = type || 'Edge';
    this.id = id;
  }

  public withItem(source: Node, target: Node): Edge {
    this.source = source;
    this.target = target;
    return this;
  };

  public getSVG(offset: Point): Element {

    let path = 'M';
    for (let i = 0; i < this.points.length; i++) {
      let point = new Point(this.points[i].x, this.points[i].y).add(offset);
      if (i > 0) {
        path += 'L';
      }
      path += Math.floor(point.x) + ' ' + Math.floor(point.y) + ' ';
    }

    let attr = {
      tag: 'path',
      id: this.id,
      d: path,
      stroke: 'black',
      'stroke-width': '2',
      fill: 'none'
    };
    let shape = this.createShape(attr);

    return shape;
  }

  protected getDirection(a: Point, b: Point): Direction {
    if (b.x < a.x) {
      return Direction.Left;
    }
    if (b.x > a.x) {
      return Direction.Right;
    }
    if (b.y < a.y) {
      return Direction.Up;
    }
    if (b.y > a.y) {
      return Direction.Down;
    }
  }

}
