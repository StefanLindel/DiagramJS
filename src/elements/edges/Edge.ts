import { DiagramElement, Point } from '../BaseElements';
import { Node } from '../nodes/Node';

export class Edge extends DiagramElement {

  public source: Node;
  public target: Node;
  public lineStyle: string;
  public points: Array<Point>;

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

}
