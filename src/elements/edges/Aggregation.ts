import { Direction, Edge } from './Edge';

export class Aggregation extends Edge {
  public getSVG(): Element {
    let endPoint = this.$points[this.$points.length-1];
    // set the startpoint lower
    endPoint.target.y =  endPoint.target.y-20;

    let startX = endPoint.target.x;
    let startY = endPoint.target.y;
    let line = super.getSVG();

    let path = `M${startX} ${startY} L${startX+6} ${startY + 10} L${startX} ${startY+20} L${startX-6} ${startY+10} Z`;

    this.id = super.getId() + '-diamond-white';

    // draw white filled arrow
    let attr = {
        tag: 'path',
        id: this.id,
        d: path,
        stroke: 'black',
        'stroke-width': '3',
        fill: 'white'
      };

    let composition = this.createShape(attr);

    let group = this.createShape({ tag: 'g' });
    group.appendChild(line);
    group.appendChild(composition);
    return group;
  }
}
