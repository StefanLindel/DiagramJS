import Line from '../Line';
import Point from '../Point';
import { Edge } from './Edge';

export class Unidirectional extends Edge {

  constructor() {
    super();
    this.typ = 'Unidirectional';
  }

  public calc(board) {
    if (!super.calc(board)) {
      return false;
    }
    this.calcMoveLine(16, 50, false);
    this.$path.push(new Line(new Point(this.$top.x, this.$top.y), new Point(this.$endPos.x, this.$endPos.y)));
    this.$path.push(new Line(new Point(this.$bot.x, this.$bot.y), new Point(this.$endPos.x, this.$endPos.y)));
    return true;
  };

}
