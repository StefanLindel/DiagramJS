import BaseElement from '../elements/BaseElement';
import Graph from '../elements/Graph';
import Point from '../elements/Point';
import { bind } from '../util';
import EventBus from './EventBus';

export default class Loader implements BaseElement {

  public abort: boolean;
  private images: Array<HTMLImageElement>;
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = graph;
  }

  public getTyp(): string {
    return '';
  }

  public getEvent(): string[] {
    return [EventBus.EVENT.LOAD];
  }

  public getCenter(): Point {
    let pos = this.getPos();
    let size = this.getSize();
    return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
  }

  public getPos(): Point {
    return null;
  }

  public getSize(): Point {
    return null;
  }

  public withSize(x: number, y: number): BaseElement {
    return this;
  }

  public length() {
    if (this.images) {
      return this.images.length;
    }
    return 0;
  }

  public draw(typ?: string): HTMLElement {
    if (this.images.length === 0) {
      this.fireEvent(this, 'loaded', null);
    } else {
      let img = this.images[0];
      this.graph.add(img);
    }
    return null;
  }

  public fireEvent(source: BaseElement, typ: string, value: Object) {
    this.graph.fireEvent(source, typ, value);
  };

  public onLoad(e) {
    let idx, img = e.target;
    idx = this.images.indexOf(img);
    img.model.withSize(img.width, img.height);
    this.graph.remove(img);
    if (idx !== -1) {
      this.images.splice(idx, 1);
    }
    this.draw();
  }

  public add(img: HTMLImageElement) {
    let that = this, func = function(e) {
      that.onLoad(e);
    };
    bind(img, 'load', func);
    this.images.push(img);
    this.draw();
  }

  public event(source: BaseElement, typ: string, value: Object): boolean {
    // TODO IMPLEMENT LOADED RESOURCE
    return true;
  }

}
