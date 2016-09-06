import Model from './Model';
import Options from './Options';
import * as Renderer from './core/renderer';
import { Size } from './elements/BaseElements';
import Layout from './layouts/Layout';
import * as Layouts from './layouts/index';
import { createShape } from './util';

export default class Graph {

  public root: HTMLElement;
  private canvas: Element;
  private model: Model;
  private options: Options;
  private canvasSize: Size;
  private layoutFactory: Object;

  constructor(json: Object, options: Options) {
    json = json || {};
    this.options = options;
    this.model = new Model(json);
    this.initFactories();
    this.initCanvas();
  }

  public layout() {
    this.getLayout().layout(this);
    Renderer.clearCanvas(this.canvas);
    Renderer.draw(this.canvas, this.model);
  }

  public getModel(): Model {
    return this.model;
  }

  public getCanvasSize(): Size {
    return this.canvasSize;
  }

  private getLayout(): Layout {
    let layout = this.options.layout || '';
    if (this.layoutFactory[layout]) {
      return new this.layoutFactory[layout]();
    }
    return new Layouts.DagreLayout();
  }

  private initFactories() {
    let layouter = Layouts;
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
    /*
    new Layouts.Random().layout(this);
    Renderer.clearCanvas(this.canvas);
    Renderer.draw(this.canvas, this.model);
    */
  }

}
