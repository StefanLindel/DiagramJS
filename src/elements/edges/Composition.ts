import { Association } from './Association';
import { Direction, Aggregate } from './index';

export class Composition extends Aggregate {
  public getSVG(): Element {
    let group = super.getSVG();
    this.$diamond.setAttributeNS(null, 'fill', 'black');

    return group;
  }
}
