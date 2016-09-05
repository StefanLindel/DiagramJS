import Line from '../Line';
import Point from '../Point';
import Edge from './Edge';

export default class Generalisation extends Edge {

  constructor() {
    super();
    this.typ = 'Generalisation';
  }

  public calc(board): boolean {
    if (!super.calc(board)) {
      return false;
    }
    this.calcMoveLine(16, 50, true);
    this.$path.push(new Line(new Point(this.$top.x, this.$top.y), new Point(this.$endPos.x, this.$endPos.y)));
    this.$path.push(new Line(new Point(this.$bot.x, this.$bot.y), new Point(this.$endPos.x, this.$endPos.y)));
    this.$path.push(new Line(new Point(this.$top.x, this.$top.y), new Point(this.$bot.x, this.$bot.y)));
    return true;
  }

  public drawSourceText(style) {
    // TODO
  };

  public drawTargetText(style) {
    // TODO
  };

}
