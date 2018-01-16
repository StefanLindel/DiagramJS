import { Edge } from './Edge';
import { Direction } from './index';
import { Association } from './Association';

export class Aggregation extends Association {
  public getSVG(): Element {
    let line = super.getSVG();
    this.$diamond.setAttributeNS(null, 'fill', 'white');

    return line;
  }
}
