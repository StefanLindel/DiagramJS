import { DiagramElement, Point } from '../BaseElements';
import { Edge } from '../edges';

export class Node extends DiagramElement {
  edges: Edge[] = [];
  maxWidth: number = 250;

  constructor(id?: string, type?: string) {
    super();
    this.withSize(150,  70);
    this.type = type || 'Node';
    this.id = id;
    this.edges = [];
  }

  public init(data) : Node{
    if (data['x'] && data['y']) {
      this.withPos(data['x'], data['y']);
    }
    if (data['width'] || data['height']) {
      this.withSize(data['width'], data['height']);
    }
    if (data['label']) {
      this.label = data['label'];
    }
    return this;
  }

  public getSVG() : Element {
    const pos = this.getPos();
    const size = this.getSize();

    const attr = {
      tag: 'rect',
      x: pos.x - size.x / 2,
      y: pos.y - size.y / 2,
      rx: 4,
      ry: 4,
      height: size.y,
      width: size.x,
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
