import BaseElement from '../BaseElement';
import Point from '../Point';

export default class SO implements BaseElement {

  private pos: Point = new Point();
  private size: Point = new Point();
  private typ: string = 'SO';

  public static create(element: Object) {
    let result: SO = new SO();
    for (let key in element) {
      if (element.hasOwnProperty(key) === false) {
        continue;
      }
      result.withKeyValue(key, element[key]);

    }
    return result;
  }

  public draw(typ?: string): HTMLElement {
    return null;
  }

  public getEvent(): string[] {
    return [];
  }

  public getTyp(): string {
    return this.typ;
  }

  public getPos(): Point {
    return this.pos;
  }

  public getSize(): Point {
    return this.size;
  }

  public withSize(x: number, y: number): SO {
    this.size = new Point(x, y);
    return this;
  }
  public getCenter(): Point {
    let pos = this.getPos();
    let size = this.getSize();
    return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
  }

  public withKeyValue(key: string, value: any): SO {
    if (key === 'typ') {
      this.typ = value;
    } else if (key === 'x') {
      this.pos.x = value;
    } else if (key === 'y') {
      this.pos.y = value;
    } else if (key === 'width') {
      this.size.x = value;
    } else if (key === 'height') {
      this.size.y = value;
    } else {
      this[key] = value;
    }
    return this;
  }

  public fireEvent(source: BaseElement, typ: string, value: Object) {
    // TODO
  }

  public event(source: BaseElement, typ: string, value: Object): boolean {
    return true;
  }

}
