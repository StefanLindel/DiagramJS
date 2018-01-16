import { Edge } from './Edge';
import { Direction } from './index';
import { Association } from './Association';

export class Composition extends Association {
  public getSVG(): Element {
    let line = super.getSVG();
    this.$diamond.setAttributeNS(null, 'fill', 'black');

    return line;
  }
}
