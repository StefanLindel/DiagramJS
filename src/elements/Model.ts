import Graph from '../core/Graph';
import { DiagramElement } from './BaseElements';
import { Edge } from './edges';
import { Node } from './nodes';
import { EventBus } from '../core/EventBus';
import { util } from '../util';

export default class Model extends DiagramElement {

  nodes: Object = {};
  edges: Object = {};
  $graph: Graph;
  private counter = 0;

  constructor(graph: Graph) {
    super();
    this.$parent = null;
    this.$graph = graph;
  }

  public init(data) {
    data = data || {};
    this.type = data.type || 'classdiagram';
    this.id = 'RootElement';
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
    this.initCanvas();
  }

  public addElement(type: string): boolean {
    type = util.toPascalCase(type);
    let id = this.getNewId(type);
    let element = <DiagramElement>this.getElement(type, id, {});
    if (element) {
      return true;
    }
    return false;
  }

  public removeElement(id: string): boolean {
    if (this.nodes[id]) {
      let node = this.nodes[id];
      delete this.nodes[id];
      for (let edge of node.edges) {
        delete this.edges[edge.id];
      }
    }
    else if (this.edges[id]) {
      delete this.edges[id];
    }
    else {
      return false;
    }
    this.$graph.layout();
    return true;
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

  private initCanvas() {
    this.$graph.canvasSize = { width: this.$graph.root.clientWidth, height: this.$graph.root.clientHeight };
    this.$graph.canvas = util.createShape( {
      tag: 'svg',
      id: 'root',
      width: this.$graph.canvasSize.width,
      height: this.$graph.canvasSize.height,
      viewBox: `${this.$graph.options.origin.x * -1} ${this.$graph.options.origin.y * -1} ${this.$graph.canvasSize.width} ${this.$graph.canvasSize.height}`
    });
    this.$view = this.$graph.canvas;
    this.$graph.root.appendChild(this.$graph.canvas);

    let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
    EventBus.register(this, 'mousedown', 'mouseup', 'mouseleave', 'mousemove', mousewheel, 'click', 'drag');
  }

  private getNewId(prefix?: string): string {
    this.counter++;
    let id = (prefix ? prefix.toLowerCase() + '-' : '') + Math.floor(Math.random() * 100000);
    return id;
  }

  private addNode(node: Node): Node {
    let type = node.type || 'Node';
    type = util.toPascalCase(type);
    let id = this.getNewId(type);
    return <Node>this.getElement(type, id, node);
  }

  private findNodeById(id: string) {
    if (this.nodes[id]) {
      return this.nodes[id];
    }
    return false;
  }

  private findNodeByLabel(label: string): Node {
    for (let index in this.nodes) {
      let node = this.nodes[index];
      if (node.label === label) {
        return node;
      }
    }
  }

  private addEdge(edge) {
    let type = edge.type || 'Edge';
    type = util.toPascalCase(type);
    let id = this.getNewId(type);

    let newEdge = <Edge>this.getElement(type, id, edge);
    let source = this.findNodeByLabel(<string>edge.source) || this.addNode(new Node().init({ label: edge.source }));
    let target = this.findNodeByLabel(<string>edge.target) || this.addNode(new Node().init({ label: edge.target }));
    newEdge.withItem(source, target);

    return newEdge;
  };

  private getElement(type: string, id: string, data: Object): DiagramElement {
    if (this.$graph.nodeFactory[type]) {
      let element: DiagramElement = new this.$graph.nodeFactory[type](id, type);
      element.init(data);
      this.nodes[id] = element;
      return element;
    }
    if (this.$graph.edgeFactory[type]) {
      let element: DiagramElement = new this.$graph.edgeFactory[type](id, type);
      element.init(data);
      this.edges[id] = element;
      return element;
    }
  }
}
