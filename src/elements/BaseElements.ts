import { util } from '../util';

export interface Size {
  width: number;
  height: number;
}

export abstract class DiagramElement {
  protected labelHeight = 25;
  protected labelFontSize = 14;
  protected attrHeight = 20;
  protected attrFontSize = 12;
  public id: string;
  public type: string;
  public label: string;
  public $view: Element;
  private pos:Point = new Point();
  private size:Point = new Point();
  protected $parent: DiagramElement = null;
  protected isDraggable: boolean = true;

  constructor(type?: string, id?: string) {
    this.type = type;
    this.id = id;
  }

  public getPos():Point {
    return this.pos;
  }
  public getSize():Point {
    return this.size;
  }
  public getCenter(): Point {
    var pos = this.getPos();
    var size = this.getSize();
    return new Point(pos.x + size.x / 2, pos.y + size.y / 2);
  }
  abstract init(data: Object);

  abstract getSVG();

  protected getRoot(): DiagramElement {
    if (this.$parent) {
      return this.$parent.getRoot();
    }
    return this;
  }

  protected createShape(attrs): Element {
		return util.createShape(attrs);
  }
  public withPos(x: number, y: number): DiagramElement {
    if (x && y) {
      this.pos = new Point(x, y);
    } else {
      if(typeof(x) != 'undefined') {
        this.pos.x = x;
      }
      if(typeof(y) != 'undefined') {
        this.pos.y = y;
      }
    }
    return this;
  }
  public withSize(width: number, height: number): DiagramElement {
    if (width && height) {
      this.size = new Point(width, height);
    } else {
      if(typeof(width) != 'undefined') {
        this.size.x = width;
      }
      if(typeof(height) != 'undefined') {
        this.size.y = height;
      }
    }
    return this;
  }
}


export class Point {
  x: number = 0;
  y: number = 0;

  constructor(x?: number, y?: number) {
    this.x = Math.ceil(x || 0);
    this.y = Math.ceil(y || 0);
  };

  public add(pos: Point) {
    this.x += pos.x;
    this.y += pos.y;
    return this;
  }

  public addNum(x: number, y: number) {
    this.x += x;
    this.y += y;
    return this;
  }

  public sum(pos: Point) {
    let sum = new Point(this.x, this.y);
    sum.add(pos);
    return sum;
  }

  public center(posA: Point, posB: Point) {
    let count = 0;
    if (posA) {
      this.x += posA.x;
      this.y += posA.y;
      count++;
    }
    if (posB) {
      this.x += posB.x;
      this.y += posB.y;
      count++;
    }
    if (count > 0) {
      this.x = (this.x / count);
      this.y = (this.y / count);
    }
  }

  public isEmpty(): boolean {
    return this.x < 1 && this.y < 1;
  }

  public size(posA: Point, posB: Point) {
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    if (posA) {
      x1 = posA.x;
      y1 = posA.y;
    }
    if (posB) {
      x2 = posB.x;
      y2 = posB.y;
    }
    if (x1 > x2) {
      this.x = x1 - x2;
    } else {
      this.x = x2 - x1;
    }
    if (y1 > y2) {
      this.y = y1 - y2;
    } else {
      this.y = y2 - y1;
    }
  };

}
