/** Creates new Point document object instance. Position with X, Y and ID
 * @class
 * @returns {Point}
 * @name Point
 */
export default class Point {
  x: number = 0;
  y: number = 0;
  $id: string;

  constructor(x?: number, y?: number, id?: string) {
    this.x = Math.ceil(x || 0);
    this.y = Math.ceil(y || 0);
    if (id) {
      this.$id = id;
    }
  };

  public add(pos: Point) {
    this.x += pos.x;
    this.y += pos.y;
    if (!this.$id) {
      this.$id = pos.$id;
    }
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
