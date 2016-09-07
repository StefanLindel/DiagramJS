import { DiagramElement, Point } from '../BaseElements';
import { Node } from '../nodes';

export const enum Direction {
  Up, Down, Left, Right
}

export class Edge extends DiagramElement {

  public source: Node;
  public target: Node;
  public lineStyle: string;
  public points: Point[];
  private shape: Element;
  private offset: Point;

  constructor(id?: string, type?: string) {
    super();
    this.type = type || 'Edge';
    this.id = id;
  }

  public init(data: Object) {
    //
  }

  public withItem(source: Node, target: Node): Edge {
    source.edges.push(this);
    target.edges.push(this);
    this.source = source;
    this.target = target;
    return this;
  };

  public getSVG(offset: Point): Element {
    this.offset = offset;

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
    this.shape = shape;
    return shape;
  }

  public redraw() {
    let a = this.getShortestPathIntersection(this.source, this.target.pos).sum(this.offset);
    let b = this.getShortestPathIntersection(this.target, this.source.pos).sum(this.offset);
    console.log(a, b);
    this.shape.setAttribute('d', `M${a.x} ${a.y} L${b.x} ${b.y}`);
    this.points = [ a, b ];
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

  private getShortestPathIntersection(node: Node, point: Point): Point {
    let x = point.x;
    let y = point.y;

    let minX = node.pos.x - node.width / 2;
    let minY = node.pos.y - node.height / 2;
    let maxX = minX + node.width;
    let maxY = minY + node.height;

    let midX = (minX + maxX) / 2;
    let midY = (minY + maxY) / 2;
    let m = (midY - y) / (midX - x);

    if (x <= midX) { // check "left" side
      let minXy = m * (minX - x) + y;
      if (minY < minXy && minXy < maxY) {
        return new Point(minX, minXy);
      }
    }

    if (x >= midX) { // check "right" side
      let maxXy = m * (maxX - x) + y;
      if (minY < maxXy && maxXy < maxY) {
        return new Point(maxX, maxXy);
      }
    }

    if (y <= midY) { // check "top" side
      let minYx = (minY - y) / m + x;
      if (minX < minYx && minYx < maxX) {
        return new Point(minYx, minY);
      }
    }

    if (y >= midY) { // check "bottom" side
      let maxYx = (maxY - y) / m + x;
      if (minX < maxYx && maxYx < maxX) {
        return new Point(maxYx, maxY);
      }
    }

  }

}
