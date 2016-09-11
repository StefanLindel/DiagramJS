import * as edges from '../elements/edges';
import * as nodes from '../elements/nodes';
import * as layouts from '../layouts';
import * as Renderer from './renderer';
import Layout from '../layouts/Layout';
import Model from '../elements/Model';
import Options from './Options';
import Palette from './Palette';
import { Size } from '../elements/BaseElements';
import { EventBus } from './EventBus';
import { Drag, Zoom } from '../handlers';

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
    this.initCanvas();
    this.model = new Model(this);
    this.model.init(json);
    this.initFeatures(options.features);
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
  }

  private initFeatures(features) {
    if (features) {
      if (features.zoom) {
        let mousewheel = 'onwheel' in document.createElement('div') ? 'wheel' : document.onmousewheel !== undefined ? 'mousewheel' : 'DOMMouseScroll';
        EventBus.subscribe(new Zoom(), mousewheel);
      }
      if (features.drag) {
        EventBus.subscribe(new Drag(), 'mousedown', 'mouseup', 'mousemove', 'mouseleave');
      }
      if (features.palette) {
        new Palette(this);
      }
    }

  }

}
