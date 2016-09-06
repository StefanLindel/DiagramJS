import { DiagramElement, Point } from '../BaseElements';
import Edge from '../edges/Edge';

export default class Node extends DiagramElement {

  pos: Point = new Point();
  size: Point = new Point();
  edges: Array<Edge>;
  width: number = 0;
  height: number = 0;

  constructor(type?: string, id?: string) {
    super();
    this.type = type || 'Node';
    this.id = id;
  }

  public withPos(x: number, y: number): Node {
    this.pos = new Point(x, y);
    return this;
  }

  public getPos(): Point {
    return this.pos;
  }

}
