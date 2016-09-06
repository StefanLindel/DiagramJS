import SymbolLibary from '../../core/SymbolLibary';
import { create, setPos } from '../../util';
import BaseElement from '../BaseElement';
import Graph from '../Graph';
import Info from '../Info';
import Point from '../Point';
import { Edge } from '../edges';

export class Node implements BaseElement {

  public id: string;
  public typ: string;
  public $gui: HTMLElement;
  public $edges: Array<Edge>;
  protected $parent: Node = null;
  protected status: string;
  protected $isDraggable: boolean = true;
  protected pos: Point = new Point();
  protected size: Point = new Point();
  protected counter: number;

  private $RIGHT: number;
  private $LEFT: number;
  private $UP: number;
  private $DOWN: number;

  constructor(typ?: string, id?: string) {
    this.typ = typ || 'node';
    this.id = id;
  }

  public static create(node): Node {
    let result: Node = new Node();
    if (node.x && node.y) {
      result.withPos(node.x, node.y);
    }
    if (node.width && node.height) {
      result.withSize(node.width, node.height);
    }
    return result;
  }

  public init(json: JSON) {
    // TODO
  };

  public getTyp(): string {
    let root: Node = this.getRoot();
    return root.getTyp();
  }

  public getEvent(): string[] {
    return [];
  }

  public getPos(): Point {
    return this.pos;
  }

  public getCenter(): Point {
    let pos = this.getPos();
    let size = this.getSize();
    return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
  }

  public getSize(): Point {
    return this.size;
  };

  public withPos(x: number, y: number): Node {
    this.pos = new Point(x, y);
    return this;
  }

  public withSize(x: number, y: number): Node {
    this.size = new Point(x, y);
    return this;
  }

  public set(id, value): void {
    if (value) {
      this[id] = value;
    }
  }

  public createNewEdge(typ: string): Node {
    return new Edge();
  }

  public createNewNode(typ: string): Node {
    return new Node();
  }

  public isClosed(): boolean {
    if (this.status === 'close') {
      return true;
    }
    if (this.$parent) {
      return this.$parent.isClosed();
    }
    return false;
  }

  public draw(typ: string): HTMLElement {
    if (typ) {
      if (typ.toLowerCase() === 'html') {
        return this.drawHTML();
      }
    } else {
      if (this.getRoot()['model'].options.display.toLowerCase() === 'html') {
        return this.drawHTML();
      }
    }
    return this.drawSVG();
  }

  public drawSVG(draw?: boolean): HTMLElement {
    let item, content;
    content = this['content'];
    if (content) {
      content.width = content.width || 0;
      content.height = content.height || 0;
      if (content.plain) {
        return create({
          tag: 'text',
          $font: true,
          'text-anchor': 'left',
          'x': (this.pos.x + 10),
          value: content.plain
        });
      }
      if (content.src) {
        item = SymbolLibary.createImage(content, this);
        if (!item) {
          return null;
        }
        return item;
      }
      item = create({ tag: 'g', model: this });
      if (content.svg) {
        item.setAttribute('transform', 'translate(' + this.pos.x + ' ' + this.pos.y + ')');
        item.innerHTML = content.$svg;
        return item;
      }
      if (content.html) {
        item.setAttribute('transform', 'translate(' + this.pos.x + ' ' + this.pos.y + ')');
        item.innerHTML = content.$svg;
        return item;
      }
    }
    item = create({
      tag: 'circle',
      'class': 'Node',
      cx: this.pos.x + 10,
      cy: this.pos.y + 10,
      r: '10',
      model: this,
      width: this.size.x,
      height: this.size.y
    });
    return item;
  }

  public drawHTML(draw?: boolean): HTMLElement {
    let item = create({ tag: 'div', model: this }), content;
    content = this['content'];
    setPos(item, this.pos.x, this.pos.y);
    if (content) {
      content.width = content.width || 0;
      content.height = content.height || 0;
      if (content.src) {
        item = SymbolLibary.createImage(content, this);
        if (!item) {
          return null;
        }
        item.appendChild(item);
      }
      if (content.html) {
        item.innerHTML = content.html;
      }
      return item;
    }
    return create({ tag: 'div', 'class': 'Node', model: this });
  }

  public addEdge(source: BaseElement, target?: BaseElement) {
    let edge;
    if (target) {
      let root = <Graph>this.getRoot();
      edge = new Edge();
      edge.withItem(root.addNode(source), root.addNode(target));
      edge.source = new Info(edge.source, this, edge);
      edge.target = new Info(edge.target, this, edge);
      edge.$parent = this.$parent;
    } else {
      edge = source;
    }
    if (!this.$edges) {
      this.$edges = [];
    }
    this.$edges.push(edge);
  }

  public getTarget(startNode: Node): Node {
    if (this.isClosed()) {
      return this;
    } else if (this.status === 'open' || this.$parent === null) {
      return startNode;
    }
    return this.$parent.getTarget(startNode);
  }

  public getShowed(): Node {
    if (this.status === 'close') {
      if (!this.$parent.isClosed()) {
        return this;
      }
    }
    if (this.isClosed()) {
      return this.$parent.getShowed();
    }
    return this;
  }

  public clear(): void {
    this.$RIGHT = this.$LEFT = this.$UP = this.$DOWN = 0;
  }

  public getRoot(): Node {
    if (this.$parent) {
      return this.$parent.getRoot();
    }
    return this;
  }

  public fireEvent(source: BaseElement, typ: string, value: Object): void {
    this.getRoot().fireEvent(source, typ, value);
  }

  public event(source: Node, typ: string, value: Object): boolean {
    return true;
  }

}
