import { Generalisation } from './Generalisation';

export class Implements extends Generalisation {

    public getSVG(): Element {
        let group = super.getSVG();

        this.$pathSvg.setAttributeNS(null, 'stroke-dasharray', '3, 3');

        return group;
    }
}
