import { Edge } from './Edge';
import { Direction } from './index';
import { Association } from './Association';

export class Aggregation extends Association {
  public getSVG(): Element {
    let group = super.getSVG();
    this.$diamond.setAttributeNS(null, 'fill', 'white');

    return group;
  }
}
