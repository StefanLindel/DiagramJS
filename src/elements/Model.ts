import Graph from '../Graph';
import { toPascalCase } from '../util';
import { DiagramElement } from './BaseElements';
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

  public addElement(type: string): boolean {
    type = toPascalCase(type);
    let id = 'New' + type + '$' + (this.elements.length + 1);
    let element = <DiagramElement>this.getElement(type, id, {});
    if (element) {
      return true;
    }
    return false;
  }

  public getSVG(): Element {

    const size = 10;
    const path = `M${-size} 0 L${+size} 0 M0 ${-size} L0 ${+size}`;

    const attr = {
      tag: 'path',
      id: 'origin',
      d: path,
      stroke: '#999',
      'stroke-width': '1',
      fill: 'none'
    };
    let shape = this.createShape(attr);

    const attrText = {
      tag: 'text',
      x: 0 - size,
      y: 0 - size / 1.5,
      'text-anchor': 'end',
      'font-family': 'Verdana',
      'font-size': '9',
      fill: '#999'
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
    return <Node>this.getElement(type, id, node);
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

    return newEdge;
  };

  private getElement(type: string, id: string, data: Object): DiagramElement {
    if (this.graph.nodeFactory[type]) {
      let element: DiagramElement = new this.graph.nodeFactory[type](id, type);
      element.init(data);
      this.nodes[id] = element;
      this.elements.push(element);
      return element;
    }
    if (this.graph.edgeFactory[type]) {
      let element: DiagramElement = new this.graph.edgeFactory[type](id, type);
      element.init(data);
      this.edges[id] = element;
      this.elements.push(element);
      return element;
    }
  }

}
