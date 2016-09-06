
export interface Label {
  text: string;
}

export interface Size {
  width: number;
  height: number;
}

export class DiagramElement {

  public id: string;
  public type: string;
  public label: Label;
  public view: Element;

  protected parent: DiagramElement = null;
  protected isDraggable: boolean = true;

  constructor(type?: string, id?: string) {
    this.type = type;
    this.id = id;
  }

  public getSVG(offset: Point): Element {
    return this.createShape({});
  }

  protected getRoot(): DiagramElement {
    if (this.parent) {
      return this.parent.getRoot();
    }
    return this;
  }

  protected createShape(attrs): Element {
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
