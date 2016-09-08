import * as Renderer from './core/renderer';
import * as edges from './elements/edges';
import * as nodes from './elements/nodes';
import * as layouts from './layouts';
import CanvasDrag from './feature/CanvasDrag';
import Layout from './layouts/Layout';
import Model from './elements/Model';
import Options from './Options';
import { createShape } from './util';
import { Size } from './elements/BaseElements';

export default class Graph {

  root: HTMLElement;
  canvas: Element;
  model: Model;
  options: Options;
  canvasSize: Size;
  nodeFactory: Object;
  edgeFactory: Object;
  layoutFactory: Object;

  constructor(json: Object, options: Options) {
    json = json || {};
    this.options = options;
    this.initFactories();
    this.model = new Model(this);
    this.model.init(json);
    this.initCanvas();
  }

  public addElement(type: string): boolean {
    let success = this.model.addElement(type);
    if (success === true) {
      this.layout();
    }
    return success;
  }

  public layout() {
    this.getLayout().layout(this);
    this.draw();
  }

  public draw() {
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
    this.nodeFactory = {};
    for (let id in noder) {
      if (noder.hasOwnProperty(id) === true) {
        this.nodeFactory[id] = noder[id];
      }
    }

    let edger = edges;
    this.edgeFactory = {};
    for (let id in edger) {
      if (edger.hasOwnProperty(id) === true) {
        this.edgeFactory[id] = edger[id];
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
    this.canvas = createShape({ tag: 'svg', id: 'root', height: this.canvasSize.height, width: this.canvasSize.width });
    this.root.appendChild(this.canvas);
    Renderer.clearCanvas(this);
    new CanvasDrag(this.canvas, this);
  }

}
