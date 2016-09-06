import { DiagramElement } from './elements/BaseElements';
import Edge from './elements/edges/Edge';
import Node from './elements/nodes/Node';
import { toPascalCase } from './util';

interface JsonNode {
  type?: string;
  id?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface JsonEdge {
  type: string;
  id?: string;
  source: string;
  target: string;
}

export default class Model extends DiagramElement {

  public nodes;
  public edges;

  private elementCount: number;

  constructor(json) {
    super();
    json = json || {};
    this.type = json.type || 'classdiagram';
    this.parent = null;

    this.nodes = [];
    this.edges = [];
    this.elementCount = 0;

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

  private addNode(node: JsonNode) {
    let type = node.type || 'Node';
    type = toPascalCase(type);

    let id = node.id ? node.id : type + '$' + (this.elementCount + 1);

    let newNode = new Node(type, id);

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
    this.elementCount++;
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
    let id = edge.id ? edge.id : type + '$' + (this.elementCount + 1);

    let source = this.findNode(edge.source) || this.addNode({ id: edge.source });
    let target = this.findNode(edge.target) || this.addNode({ id: edge.target });

    let newEdge = new Edge(type, id).withItem(source, target);

    if (this.edges[newEdge.id]) {
      return this.edges[newEdge.id];
    }
    this.edges[newEdge.id] = newEdge;
    this.elementCount++;
    return this.edges[newEdge.id];
  };

}
