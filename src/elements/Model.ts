import Graph from '../Graph';
import { toPascalCase } from '../util';
import { DiagramElement, Point } from './BaseElements';
import { Edge } from './edges';
import { Node } from './nodes';

interface JsonNode {
  type?: string;
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  attributes?: string[];
  methods?: string[];
}

interface JsonEdge {
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

  constructor(graph: Graph, json) {
    super();
    json = json || {};
    this.type = json.type || 'classdiagram';
    this.parent = null;
    this.graph = graph;

    if (json.nodes) {
      for (let node of json.nodes) {
        this.addNode(node);
      }
    }
    if (json.edges) {
      for (let edge of json.edges) {
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

  private addNode(node: JsonNode): Node {
    let type = node.type || 'Node';
    type = toPascalCase(type);

    let id = node.id ? node.id : type + '$' + (this.elements.length + 1);

    let newNode: Node;
    if (this.graph.nodeFactory[type]) {
      newNode = new this.graph.nodeFactory[type](id);
    }
    newNode = new this.graph.nodeFactory[type](id);
    newNode.init(node);

    if (node['x'] || node['y']) {
      newNode.withPos(node['x'], node['y']);
    }
    if (node['width'] || node['height']) {
      newNode.withPos(node['width'], node['height']);
    }

    if (this.findNode(this.nodes[newNode.id])) {
      return this.nodes[newNode.id];
    }
    this.nodes[newNode.id] = newNode;
    this.elements.push(newNode);
    return this.nodes[newNode.id];
  }

  private findNode(id: string) {
    if (this.nodes[id]) {
      return this.nodes[id];
    }
    return false;
  }

  private addEdge(edge: JsonEdge) {
    let type = edge.type || 'Edge';
    type = toPascalCase(type);
    let id = edge.id ? edge.id : type + '$' + (this.elements.length + 1);

    let source = this.findNode(edge.source) || this.addNode({ id: edge.source });
    let target = this.findNode(edge.target) || this.addNode({ id: edge.target });

    let newEdge = new Edge(type, id).withItem(source, target);

    if (this.edges[newEdge.id]) {
      return this.edges[newEdge.id];
    }
    this.edges[newEdge.id] = newEdge;
    this.elements.push(newEdge);
    return this.edges[newEdge.id];
  };

}
