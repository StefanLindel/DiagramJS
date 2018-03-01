import { Association } from './Association';
import { Direction, Aggregate } from './index';

export class Aggregation extends Aggregate {
  public getSVG(): Element {
    let group = super.getSVG();
    this.$diamond.setAttributeNS(null, 'fill', 'white');

    return group;
  }
}
