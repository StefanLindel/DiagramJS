import CSS from '../core/CSS';
import EventBus from '../core/EventBus';
import Loader from '../core/Loader';
import Options from '../core/Options';
import SymbolLibary from '../core/SymbolLibary';
import { sizeOf } from '../util';
import BaseElement from './BaseElement';
import Header from './Header';
import Model from './Model';
import Point from './Point';
import { Edge } from './edge/Edge';
import * as Edges from './edges';
import { DagreLayoutOld, Layout } from './layouts';
import * as Layouts from './layouts';
import { Node, Symbol } from './nodes';
import * as Nodes from './nodes';

export default class Graph extends Node {

  public $root: HTMLElement;
  protected edgeFactory: Object;
  protected nodeFactory: Object;
  protected layoutFactory: Object;
  protected header: Header;
  private model: Model;
  private minSize: Point;
  private eventBus: EventBus;
  private loader: Loader;

  // TODO private layoutFactory:Array<String, Layout>;
  constructor(json: any, options: Options) {
    super('');
    new Node();
    json = json || {};
    json.top = json.top || 50;
    json.left = json.left || 10;

    this.eventBus = new EventBus();
    this.eventBus.addElement(this);
    this.loader = new Loader(this);
    this.header = new Header(this);
    this.eventBus.addElement(this.header);

    // Fill all Factories
    let nodes = Nodes;
    this.nodeFactory = {};
    for (let id in nodes) {
      if (nodes.hasOwnProperty(id) === false) {
        continue;
      }
      this.nodeFactory[id] = nodes[id];
    }

    let edges = Edges;
    this.edgeFactory = {};
    for (let id in edges) {
      if (edges.hasOwnProperty(id) === false) {
        continue;
      }
      this.edgeFactory[id] = edges[id];
    }

    let layouter = Layouts;
    this.layoutFactory = {};
    for (let id in layouter) {
      if (layouter.hasOwnProperty(id) === false) {
        continue;
      }
      this.layoutFactory[id] = layouter[id];
    }
    this.model = new Model(json, options, this);
  }

  public addToNodeFactory(node: BaseElement) {
    let name: string = typeof (node);
    this.nodeFactory[name] = node;
  }

  public getModel(): Model {
    return this.model;
  }

  public event(source: Node, typ: string, value: Object): boolean {
    if (this.getTyp() === 'svg') {
      if (EventBus.EVENT.CREATED === typ) {
        CSS.addStyles(this.$gui, value['$gui']);
      }
    }
    return true;
  }

  public getEvent(): string[] {
    return [EventBus.EVENT.CREATED];
  }

  public getLayout(): Layout {
    let layout = this.getOptions().layout || {};
    let layoutName: string;
    if (typeof layout === 'string' || layout instanceof String) {
      layoutName = <string>layout;
    } else {
      layoutName = layout['name'] || 'DagreLayout';
    }
    if (this.layoutFactory[layoutName]) {
      return new this.layoutFactory[layoutName]();
    }
    return new DagreLayoutOld();
  }

  public draw(typ?: string): HTMLElement {
    // model, width, height
    // let n: Node;
    let nodes: Object, model: Model;
    model = this.model;
    nodes = model.nodes;
    if (!typ) {
      typ = this.getTyp();
    }
    // model.minSize = new Pos(model.options.minWidth || 0, model.options.minHeight || 0);
    if (this.loader.abort && this.loader.length() > 0) {
      return;
    }
    this.model.drawComponents();
    // TODO
    // for (i in nodes) {
    // 	if (!nodes.hasOwnProperty(i)) {
    // 		continue;
    // 	}
    // 	if (typeof (nodes[i]) === 'function') {
    // 		continue;
    // 	}
    // 	n = nodes[i];
    // 	n.$gui = n.draw(typ);
    // 	if (typ === 'svg') {
    // 		//svgUtil.addStyle(board, 'ClazzHeader');
    // 		CSS.addStyles(this.board, n.$gui);
    // 	}
    // 	this.DragAndDrop.add(n.$gui);
    // 	model.$gui.appendChild(n.$gui);
    // }//
  }

  public createNewEdge(typ: string): Node {
    if (this.edgeFactory[typ]) {
      return new this.edgeFactory[typ]();
    }
    return super.createNewEdge(typ);
  }

  public createNewNode(typ: string): Node {
    if (this.nodeFactory[typ]) {
      return new this.nodeFactory[typ]();
    } else if (SymbolLibary.isSymbolName(typ)) {
      return new Symbol(typ);
    }
    return super.createNewNode(typ);
  }

  public getOptions(): Options {
    return this.model.options;
  }

  public addNode(node) {
    return this.model.addNode(node);
  }

  public addEdge(source, target) {
    return this.model.addEdge(source, target);
  }

  public removeNode(id) {
    return this.model.removeNode(id);
  }

  public add(element: HTMLElement) {
    this.$gui.appendChild(element);
  }

  public remove(element: HTMLElement) {
    this.$gui.removeChild(element);
  }

  public initGraph(model: Model) {
    let i, n: Node, isDiag: boolean, html: HTMLElement, e: Edge;
    model.validateModel();
    for (i in model.nodes) {
      if (!model.nodes.hasOwnProperty(i)) {
        continue;
      }
      if (typeof (model.nodes[i]) === 'function') {
        continue;
      }
      n = model.nodes[i];
      isDiag = n.typ.indexOf('diagram', n.typ.length - 7) !== -1;
      if (isDiag) {
        this.initGraph(<Model>n);
      }
      html = n.draw(model.options.display);
      if (html) {
        sizeOf(html, this, n);
      }
    }
    for (i = 0; i < model.edges.length; i += 1) {
      e = model.edges[i];
      e.source.initInfo();
      e.target.initInfo();
    }
  }

  public initBoard(newTyp?: string): void {
    if (!newTyp) {
      newTyp = this.getTyp();
    } else {
      this.model.options.display = newTyp;
      newTyp = newTyp.toLowerCase();
    }
    this.clearBoard();
    this.$gui = this.model.getBoard(newTyp);
    this.$root.appendChild(this.$gui);
  }

  public getTyp(): string {
    return this.model.options.display.toLowerCase();
  }

  public clearBoard = function(onlyElements?: boolean): void {
    let i, n;
    if (this.board) {
      this.clearLines(this.model);
      for (i in this.model.nodes) {
        if (!this.model.nodes.hasOwnProperty(i)) {
          continue;
        }
        n = this.model.nodes[i];
        if (this.board.children.length > 0) {
          n.removeFromBoard(this.board);
        }
        n.$RIGHT = n.$LEFT = n.$UP = n.$DOWN = 0;
      }
      if (!onlyElements) {
        this.root.removeChild(this.board);
      }
    }
    if (!onlyElements && this.drawer) {
      this.drawer.clearBoard();
    }
  };

  public layout(minwidth?: number, minHeight?: number, model?: any) {
    let i: number;
    if (this.model.options.canvasid) {
      this.$root = document.getElementById(this.model.options.canvasid);
    }
    if (this.$root) {
      if (this.model.options.clearCanvas) {
        for (i = this.$gui.children.length - 1; i >= 0; i -= 1) {
          this.$root.removeChild(this.$gui.children[i]);
        }
      }
    } else {
      this.$root = document.createElement('div');
      this.$root.setAttribute('class', 'Board');
      if (this.model.options.canvasid) {
        this.$root.id = this.model.options.canvasid;
      }
      document.body.appendChild(this.$root);
    }
    this.initBoard();
    this.eventBus.register(this.$gui);

    if (!model) {
      model = this.model;
    }
    this.initGraph(model);
    this.minSize = new Point(minwidth, minHeight);
    this.getLayout().layout(this, this.model);
  }

  public fireEvent(source: BaseElement, typ: string, value: Object) {
    this.eventBus.fireEvent(source, typ, value);
  }

}
