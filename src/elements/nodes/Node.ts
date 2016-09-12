import { DiagramElement, Point } from '../BaseElements';
import { Edge } from '../edges';

export class Node extends DiagramElement {

  pos: Point = new Point();
  size: Point = new Point();
  edges: Edge[] = [];
  width: number = 150;
  height: number = 70;
  maxWidth: number = 250;

  constructor(id?: string, type?: string) {
    super();
    this.type = type || 'Node';
    this.id = id;
    this.edges = [];
  }

  public init(data) {
    if (data['x'] && data['y']) {
      this.pos = new Point(data['x'], data['y']);
    }
    if (data['width'] || data['height']) {
      this.size = new Point(data['width'], data['height']);
    }
  }

  public withPos(x: number, y: number): Node {
    if (x && y) {
      this.pos = new Point(x, y);
    }
    return this;
  }

  public getSVG(): Element {
    const pos = this.pos;

    const attr = {
      tag: 'rect',
      x: pos.x - this.width / 2,
      y: pos.y - this.height / 2,
      rx: 4,
      ry: 4,
      height: this.height,
      width: this.width,
      style: 'fill:white;stroke:black;stroke-width:2'
    };
    const shape = this.createShape(attr);

    const attrText = {
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

    let group = this.createShape({tag: 'g', id: this.id});
    group.appendChild(shape);
    group.appendChild(text);

    return group;
  }

  public redrawEdges() {
    for (let edge of this.edges) {
      edge.redraw();
    }
  }

}
