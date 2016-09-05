import { create } from '../util';
import Graph from './Graph';
import Line from './Line';
import Node from './node/Node';
import Point from './Point';

export default class Raster extends Node {
  private range: number = 10;

  constructor($parent: Graph) {
    super('Raster');
    this.$parent = $parent;
  }

  public draw(draw?: string): HTMLElement {
    let y: number, height: number, line: HTMLElement, i: number, parent: any = this.$parent;
    if (draw === 'HTML') {
      this.$gui = parent.getBoard('svg');
    } else {
      this.$gui = create({ tag: 'g' });
    }
    y = parent['width'];
    height = this.pos.y;
    for (i = this.range; i < y; i += this.range) {
      line = new Line(new Point(i, 0), new Point(i, height), null, '#ccc').draw();
      line.setAttribute('className', 'lineRaster');
      this.$gui.appendChild(line);
    }
    for (i = this.range; i < height; i += this.range) {
      line = new Line(new Point(0, i), new Point(0, y), null, '#ccc').draw();
      line.setAttribute('className', 'lineRaster');
      this.$gui.appendChild(line);
    }
    return this.$gui;
  }

  public moveToRaster(node: Node) {
    let pos = node.getPos();
    node.withPos(parseInt('' + (pos.x / this.range), this.range) * this.range, parseInt('' + (pos.y / this.range), this.range) * this.range);
  }

}
