import Line from '../Line';
import Edge from './Edge';

export default class Aggregation extends Edge {

  constructor() {
    super();
    this.typ = 'Aggregation';
  }

  public calc(board) {
    if (!super.calc(board)) {
      return false;
    }
    this.calcMoveLine(16, 49.8, true);
    this.$path.push(new Line().withPath([this.endPos().target, this.$topCenter, this.$endPos, this.$botCenter], true, true).withColor('#FFF'));
    return true;
  }

}