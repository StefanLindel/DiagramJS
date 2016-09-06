import { DiagramElement, Point } from '../BaseElements';
import Node from '../nodes/Node';

export default class Edge extends DiagramElement {

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

}
