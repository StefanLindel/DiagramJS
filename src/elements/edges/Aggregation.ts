import { Direction, Edge } from './Edge';

export class Aggregation extends Edge {

  public getSVG(): Element {
    let line = super.getSVG();

    const endPointA = this.points[this.points.length - 1];
    const endPointB = this.points[this.points.length - 2];
    let direction = this.getDirection(endPointA, endPointB);

    const x = endPointA.x;
    const y = endPointA.y;

    let path: string;
    switch (direction) {
      case Direction.Up:    path = `M${x} ${y - 1} L${x + 10} ${y - 11} L${x} ${y - 21} L${x - 10} ${y - 11} Z`; break;
      case Direction.Down:  path = `M${x} ${y} L${x + 10} ${y - 10} L${x} ${y - 20} L${x - 10} ${y - 10} Z`; break;
      case Direction.Left:  path = `M${x} ${y} L${x - 10} ${y - 10} L${x - 20} ${y} L${x - 10} ${y + 10} Z`; break;
      case Direction.Right: path = `M${x} ${y} L${x + 10} ${y - 10} L${x + 20} ${y} L${x + 10} ${y + 10} Z`; break;
    }

    let attr = {
      tag: 'path',
      d: path,
      stroke: 'black',
      'stroke-width': '2',
      fill: 'white'
    };
    let connector = this.createShape(attr);

    let group = this.createShape({ tag: 'g' });
    group.appendChild(line);
    group.appendChild(connector);
    return group;
  }

}
