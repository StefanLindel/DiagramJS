import Graph from '../Graph';
import { toPascalCase } from '../util';
import { DiagramElement, Point } from './BaseElements';
import { Edge } from './edges';
import { Node } from './nodes';

interface DataNode {
  type?: string;
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  attributes?: string[];
  methods?: string[];
}

interface DataEdge {
  type: string;
  id?: string;
  source: string;
  target: string;
}

export default class Model extends DiagramElement {

  nodes: Node[] = [];
  edges: Edge[] = [];
  elements: DiagramElement[] = [];
  private graph: Graph;

  constructor(graph: Graph) {
    super();
    this.parent = null;
    this.graph = graph;
  }

  public init(data) {
    data = data || {};
    this.type = data.type || 'classdiagram';
    if (data.nodes) {
      for (let node of data.nodes) {
        this.addNode(node);
      }
    }
    if (data.edges) {
      for (let edge of data.edges) {
        this.addEdge(edge);
      }
    }
  }

  public getSVG(origin: Point): Element {
    const size = 10;

    let path = 'M' + origin.x + ' ' + origin.y + 'L' + (origin.x + size) + ' ' + origin.y;
    path += ' M' + origin.x + ' ' + origin.y + 'L' + (origin.x - size) + ' ' + origin.y;
    path += ' M' + origin.x + ' ' + origin.y + 'L' + origin.x + ' ' + (origin.y + size);
    path += ' M' + origin.x + ' ' + origin.y + 'L' + origin.x + ' ' + (origin.y - size);

    let attr = {
      tag: 'path',
      id: 'origin',
      d: path,
      stroke: '#CCC',
      'stroke-width': '1',
      fill: 'none'
    };
    let shape = this.createShape(attr);

    let attrText = {
      tag: 'text',
      x: origin.x - size,
      y: origin.y - size / 1.5,
      'text-anchor': 'end',
      'font-family': 'Verdana',
      'font-size': '9',
      fill: '#CCC'
    };
    let text = this.createShape(attrText);
    text.textContent = '(0, 0)';

    let group = this.createShape({ tag: 'g' });
    group.appendChild(shape);
    group.appendChild(text);

    return group;
  }

  private addNode(node: DataNode): Node {
    let type = node.type || 'Node';
    type = toPascalCase(type);
    let id = node.id ? node.id : type + '$' + (this.elements.length + 1);

    let newNode = <Node>this.getElement(type, id, node);

    if (this.nodes[id]) {
      return this.nodes[id];
    }
    this.nodes[id] = newNode;
    this.elements.push(newNode);
    return newNode;
  }

  private findNode(id: string) {
    if (this.nodes[id]) {
      return this.nodes[id];
    }
    return false;
  }

  private addEdge(edge: DataEdge) {
    let type = edge.type || 'Edge';
    type = toPascalCase(type);
    let id = edge.id ? edge.id : type + '$' + (this.elements.length + 1);

    let newEdge = <Edge>this.getElement(type, id, edge);

    let source = this.findNode(edge.source) || this.addNode({ id: edge.source });
    let target = this.findNode(edge.target) || this.addNode({ id: edge.target });
    newEdge.withItem(source, target);

    if (this.edges[id]) {
      return this.edges[id];
    }
    this.edges[id] = newEdge;
    this.elements.push(newEdge);
    return newEdge;
  };

  private getElement(type: string, id: string, data: Object): DiagramElement {
    if (this.graph.elementFactory[type]) {
      let element: DiagramElement = new this.graph.elementFactory[type](id, type);
      element.init(data);
      return element;
    }
  }

}
