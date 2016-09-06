import { DiagramElement, Point } from '../BaseElements';
import { Edge } from '../edges/Edge';

export class Node extends DiagramElement {

  pos: Point = new Point();
  size: Point = new Point();
  edges: Array<Edge>;
  width: number = 130;
  height: number = 70;

  constructor(id?: string, type?: string) {
    super();
    this.type = type || 'Node';
    this.id = id;
    this.edges = [];
  }

  public init(json) {
    //
  }

  public withPos(x: number, y: number): Node {
    this.pos = new Point(x, y);
    return this;
  }

  public getSVG(offset: Point): Element {
    let pos = offset.sum(this.pos);

    let attr = {
      tag: 'rect',
      id: this.id,
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2,
      rx: 5,
      ry: 5,
      height: this.height,
      width: this.width,
      style: 'fill:none;stroke:black;stroke-width:2'
    };
    let shape = this.createShape(attr);

    let attrText = {
      tag: 'text',
      x: pos.x,
      y: pos.y,
      'text-anchor': 'middle',
      'alignment-baseline': 'middle',
      'font-family': 'Verdana',
      'font-size': '14',
      fill: 'black'
    };
    let text = this.createShape(attrText);
    text.textContent = this.id;

    let group = this.createShape({tag: 'g'});
    group.appendChild(shape);
    group.appendChild(text);

    return group;
  }

}
