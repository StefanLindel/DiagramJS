import Options from './Options';
import * as Renderer from './core/renderer';
import { Size } from './elements/BaseElements';
import Model from './elements/Model';
import * as edges from './elements/edges';
import * as nodes from './elements/nodes';
import * as layouts from './layouts';
import Layout from './layouts/Layout';
import DragListener from './feature/DragListener';

export default class Graph {

  root: HTMLElement;
  canvas: Element;
  model: Model;
  options: Options;
  canvasSize: Size;
  nodeFactory: Object;
  edgeFactory: Object;
  layoutFactory: Object;
  elementFactory: Object;

  constructor(json: Object, options: Options) {
    json = json || {};
    this.options = options;
    this.initFactories();
    this.model = new Model(this);
    this.model.init(json);
    this.initCanvas();
  }

  public layout() {
    this.getLayout().layout(this);
    Renderer.clearCanvas(this);
    Renderer.draw(this);
  }

  private getLayout(): Layout {
    let layout = this.options.layout || '';
    if (this.layoutFactory[layout]) {
      return new this.layoutFactory[layout]();
    }
    return new layouts.DagreLayout();
  }

  private initFactories() {
    let noder = nodes;
    let edger = edges;
    this.elementFactory = {};
    for (let id in noder) {
      if (noder.hasOwnProperty(id) === true) {
        this.elementFactory[id] = noder[id];
      }
    }
    for (let id in edger) {
      if (edger.hasOwnProperty(id) === true) {
        this.elementFactory[id] = edger[id];
      }
    }

    let layouter = layouts;
    this.layoutFactory = {};
    for (let id in layouter) {
      if (layouter.hasOwnProperty(id) === true) {
        this.layoutFactory[id] = layouter[id];
      }
    }
  }

  private initCanvas() {
    if (this.options.canvas) {
      this.root = document.getElementById(this.options.canvas);
    } else {
      this.root = document.createElement('div');
      this.root.setAttribute('class', 'diagram');
      document.body.appendChild(this.root);
    }
    this.canvasSize = { width: this.root.clientWidth, height: this.root.clientHeight };
    this.canvas = this.createShape({ tag: 'svg', id: 'root', height: this.canvasSize.height, width: this.canvasSize.width });
    this.root.appendChild(this.canvas);
    Renderer.clearCanvas(this);

/*
     let attr = { tag: 'rect', id: 'r1', x: 300, y: 300, height: 100, width: 100, style: 'fill:black' };
     let rect = this.createShape(attr);
     let group = this.createShape({ tag: 'g', id: 'ball', transform: 'translate(0 0)' });
     group.appendChild(rect);

     this.canvas.appendChild(group);
     new DragListener(group, null);
*/
  }

  private createShape(attrs): Element {
    let xmlns = attrs.xmlns || 'http://www.w3.org/2000/svg';
    let shape = document.createElementNS(xmlns, attrs.tag);
    for (let attr in attrs) {
      if (attr !== 'tag') {
        shape.setAttribute(attr, attrs[attr]);
      }
    }
    return shape;
  }

}
